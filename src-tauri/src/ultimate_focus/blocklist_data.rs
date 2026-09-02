//! Ultimate Focus — Native blocklist engine.
//!
//! Reuses the existing domain list from `extension/blocklist.js` without modifying
//! the browser extension files or creating duplicate definitions.

use std::collections::HashSet;
use std::sync::OnceLock;

static BLOCKED_DOMAINS: OnceLock<HashSet<String>> = OnceLock::new();

/// Returns the global set of blocked domains extracted from the blocklist dataset.
fn get_blocked_domains() -> &'static HashSet<String> {
    BLOCKED_DOMAINS.get_or_init(|| {
        let mut set = HashSet::new();

        // Safe controlled test domains for verification without visiting actual adult sites
        set.insert("blocked.test".to_string());
        set.insert("example-blocked.test".to_string());
        set.insert("bad-domain.test".to_string());

        // Parse domain strings directly from extension/blocklist.js at compile time
        let blocklist_js = include_str!("../../../extension/blocklist.js");
        for line in blocklist_js.lines() {
            let trimmed = line.trim();
            if let Some(start) = trimmed.find('\'') {
                if let Some(end) = trimmed[start + 1..].find('\'') {
                    let domain = &trimmed[start + 1..start + 1 + end];
                    let clean = domain.trim().to_lowercase();
                    if !clean.is_empty() && clean.contains('.') {
                        set.insert(clean);
                    }
                }
            }
        }

        log::info!("ultimate focus: loaded {} blocked domains into native engine", set.len());
        set
    })
}

/// Checks whether a given hostname/domain is blocked.
///
/// Matches both exact domain (e.g. `pornhub.com`) and subdomains (e.g. `www.pornhub.com`, `video.pornhub.com`).
pub fn is_domain_blocked(domain: &str) -> bool {
    let raw = domain.trim().trim_end_matches('.').to_lowercase();
    if raw.is_empty() {
        return false;
    }

    let set = get_blocked_domains();

    // Direct match check
    if set.contains(&raw) {
        return true;
    }

    // Check parent domain suffixes (e.g. "sub.pornhub.com" -> check "pornhub.com")
    let parts: Vec<&str> = raw.split('.').collect();
    if parts.len() > 2 {
        for i in 1..parts.len() - 1 {
            let parent = parts[i..].join(".");
            if set.contains(&parent) {
                return true;
            }
        }
    }

    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_domain_blocking() {
        assert!(is_domain_blocked("blocked.test"));
        assert!(is_domain_blocked("sub.blocked.test"));
        assert!(is_domain_blocked("pornhub.com"));
        assert!(is_domain_blocked("www.pornhub.com"));
        assert!(!is_domain_blocked("google.com"));
        assert!(!is_domain_blocked("github.com"));
    }
}

