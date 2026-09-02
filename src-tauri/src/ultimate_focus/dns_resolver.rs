//! Ultimate Focus — Local DNS Resolver engine.
//!
//! A lightweight, zero-dependency, safe UDP DNS server.
//! Listens on 127.0.0.1:53 and [::1]:53 (loopback only).
//!
//! - Blocked domains -> direct response with 0.0.0.0 (A) / :: (AAAA).
//! - Allowed domains -> forwarded to upstream DNS (e.g. 1.1.1.1:53 / 8.8.8.8:53).

use std::net::{SocketAddr, UdpSocket};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::Duration;

use super::blocklist_data::is_domain_blocked;

/// Upstream fallback DNS servers when active adapter DNS is unavailable.
const DEFAULT_UPSTREAM_DNS: &[&str] = &["1.1.1.1:53", "8.8.8.8:53"];

pub struct DnsResolverHandle {
    running: Arc<AtomicBool>,
}

impl DnsResolverHandle {
    pub fn stop(&self) {
        self.running.store(false, Ordering::SeqCst);
    }

    #[allow(dead_code)]
    pub fn is_running(&self) -> bool {
        self.running.load(Ordering::SeqCst)
    }
}

/// Starts the local DNS resolver listening on `127.0.0.1:53` and `[::1]:53`.
/// Returns a handle to stop the resolver, or an error message if binding fails.
pub fn start_dns_resolver(upstream_servers: Vec<String>) -> Result<DnsResolverHandle, String> {
    let ipv4_socket = UdpSocket::bind("127.0.0.1:53")
        .map_err(|e| format!("Failed to bind local IPv4 DNS resolver on 127.0.0.1:53: {e}. Check if another DNS service is using port 53."))?;
    
    // Set socket read timeout so loop can check `running` state periodically
    ipv4_socket
        .set_read_timeout(Some(Duration::from_millis(500)))
        .map_err(|e| format!("Failed to set socket read timeout: {e}"))?;

    // Try binding IPv6 socket on [::1]:53 (optional, best-effort if IPv6 loopback is supported)
    let ipv6_socket = UdpSocket::bind("[::1]:53").ok();
    if let Some(ref sock) = ipv6_socket {
        let _ = sock.set_read_timeout(Some(Duration::from_millis(500)));
    }

    let running = Arc::new(AtomicBool::new(true));

    let running_v4 = Arc::clone(&running);
    let upstreams_v4 = upstream_servers.clone();
    std::thread::spawn(move || {
        run_resolver_loop(ipv4_socket, upstreams_v4, running_v4);
    });

    if let Some(sock_v6) = ipv6_socket {
        let running_v6 = Arc::clone(&running);
        let upstreams_v6 = upstream_servers;
        std::thread::spawn(move || {
            run_resolver_loop(sock_v6, upstreams_v6, running_v6);
        });
    }

    log::info!("ultimate focus: local DNS resolver started successfully on 127.0.0.1:53");

    Ok(DnsResolverHandle { running })
}

fn run_resolver_loop(socket: UdpSocket, custom_upstreams: Vec<String>, running: Arc<AtomicBool>) {
    let mut buf = [0u8; 512];

    while running.load(Ordering::SeqCst) {
        match socket.recv_from(&mut buf) {
            Ok((len, src)) => {
                if len < 12 {
                    continue; // Invalid DNS header length
                }

                let packet = &buf[..len];
                if let Some((qname, qtype, _qclass, _qname_end)) = parse_dns_question(packet) {
                    if is_domain_blocked(&qname) {
                        log::info!("ultimate focus DNS: BLOCKED request for '{qname}' from {src}");
                        let response = build_blocked_response(packet, qtype);
                        let _ = socket.send_to(&response, src);
                    } else {
                        // Forward query to upstream DNS
                        if let Ok(response) = forward_query(packet, &custom_upstreams) {
                            let _ = socket.send_to(&response, src);
                        } else {
                            // On upstream error, return SERVFAIL
                            let response = build_servfail_response(packet);
                            let _ = socket.send_to(&response, src);
                        }
                    }
                } else {
                    // Could not parse question: return FORMERR
                    let response = build_formerr_response(packet);
                    let _ = socket.send_to(&response, src);
                }
            }
            Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock || e.kind() == std::io::ErrorKind::TimedOut => {
                // Read timeout — loop back and check `running`
                continue;
            }
            Err(e) => {
                log::error!("ultimate focus DNS: recv_from error: {e}");
                std::thread::sleep(Duration::from_millis(100));
            }
        }
    }

    log::info!("ultimate focus: local DNS resolver thread exited loop");
}

/// Parses the QNAME, QTYPE, QCLASS, and end offset of the first Question in a DNS packet.
fn parse_dns_question(packet: &[u8]) -> Option<(String, u16, u16, usize)> {
    if packet.len() < 12 {
        return None;
    }

    let qdcount = u16::from_be_bytes([packet[4], packet[5]]);
    if qdcount == 0 {
        return None;
    }

    let mut pos = 12;
    let mut domain_parts = Vec::new();

    loop {
        if pos >= packet.len() {
            return None;
        }
        let len = packet[pos] as usize;
        if len == 0 {
            pos += 1;
            break;
        }

        // Check for DNS pointer (compression)
        if (len & 0xC0) == 0xC0 {
            pos += 2;
            break;
        }

        pos += 1;
        if pos + len > packet.len() {
            return None;
        }

        let label = std::str::from_utf8(&packet[pos..pos + len]).ok()?;
        domain_parts.push(label);
        pos += len;
    }

    if pos + 4 > packet.len() {
        return None;
    }

    let qtype = u16::from_be_bytes([packet[pos], packet[pos + 1]]);
    let qclass = u16::from_be_bytes([packet[pos + 2], packet[pos + 3]]);
    let qname = domain_parts.join(".");

    Some((qname, qtype, qclass, pos + 4))
}

/// Builds a DNS response returning 0.0.0.0 (A) or :: (AAAA) for blocked domains.
fn build_blocked_response(query: &[u8], qtype: u16) -> Vec<u8> {
    let mut resp = Vec::with_capacity(64);

    // 1. Transaction ID (copy from query)
    resp.extend_from_slice(&query[0..2]);

    // 2. Flags: Standard query response, No error (0x8180)
    resp.extend_from_slice(&[0x81, 0x80]);

    // 3. QDCOUNT = 1, ANCOUNT = 1, NSCOUNT = 0, ARCOUNT = 0
    resp.extend_from_slice(&[0x00, 0x01]); // QDCOUNT
    resp.extend_from_slice(&[0x00, 0x01]); // ANCOUNT
    resp.extend_from_slice(&[0x00, 0x00]); // NSCOUNT
    resp.extend_from_slice(&[0x00, 0x00]); // ARCOUNT

    // 4. Copy original Question section
    if let Some((_, _, _, question_end)) = parse_dns_question(query) {
        resp.extend_from_slice(&query[12..question_end]);
    } else {
        return build_servfail_response(query);
    }

    // 5. Answer Record
    // Name pointer -> offset 12 (0xC00C)
    resp.extend_from_slice(&[0xC0, 0x0C]);

    if qtype == 28 {
        // AAAA record (IPv6 ::)
        resp.extend_from_slice(&[0x00, 0x1C]); // TYPE = AAAA (28)
        resp.extend_from_slice(&[0x00, 0x01]); // CLASS = IN (1)
        resp.extend_from_slice(&[0x00, 0x00, 0x01, 0x2C]); // TTL = 300
        resp.extend_from_slice(&[0x00, 0x10]); // RDLENGTH = 16
        resp.extend_from_slice(&[0u8; 16]); // RDATA = :: (16 zero bytes)
    } else {
        // A record (IPv4 0.0.0.0) or default
        resp.extend_from_slice(&[0x00, 0x01]); // TYPE = A (1)
        resp.extend_from_slice(&[0x00, 0x01]); // CLASS = IN (1)
        resp.extend_from_slice(&[0x00, 0x00, 0x01, 0x2C]); // TTL = 300
        resp.extend_from_slice(&[0x00, 0x04]); // RDLENGTH = 4
        resp.extend_from_slice(&[0, 0, 0, 0]); // RDATA = 0.0.0.0
    }

    resp
}

fn build_servfail_response(query: &[u8]) -> Vec<u8> {
    let mut resp = Vec::from(&query[..12.min(query.len())]);
    if resp.len() >= 4 {
        // QR=1, RCODE=2 (SERVFAIL) -> 0x8182
        resp[2] = 0x81;
        resp[3] = 0x82;
    }
    resp
}

fn build_formerr_response(query: &[u8]) -> Vec<u8> {
    let mut resp = Vec::from(&query[..12.min(query.len())]);
    if resp.len() >= 4 {
        // QR=1, RCODE=1 (FORMERR) -> 0x8181
        resp[2] = 0x81;
        resp[3] = 0x81;
    }
    resp
}

/// Forwards an allowed DNS query to upstream resolvers over UDP.
fn forward_query(query: &[u8], custom_upstreams: &[String]) -> Result<Vec<u8>, String> {
    let socket = UdpSocket::bind("0.0.0.0:0").map_err(|e| format!("Failed to bind client UDP socket: {e}"))?;
    socket
        .set_read_timeout(Some(Duration::from_millis(2000)))
        .map_err(|e| format!("Failed to set timeout: {e}"))?;

    let mut targets = Vec::new();
    for u in custom_upstreams {
        if let Ok(addr) = u.parse::<SocketAddr>() {
            targets.push(addr);
        } else if let Ok(addr) = format!("{u}:53").parse::<SocketAddr>() {
            targets.push(addr);
        }
    }
    for default_u in DEFAULT_UPSTREAM_DNS {
        if let Ok(addr) = default_u.parse::<SocketAddr>() {
            targets.push(addr);
        }
    }

    let mut buf = [0u8; 512];
    for target in targets {
        if socket.send_to(query, target).is_ok() {
            if let Ok((len, _)) = socket.recv_from(&mut buf) {
                return Ok(buf[..len].to_vec());
            }
        }
    }

    Err("All upstream DNS servers timed out".to_string())
}
