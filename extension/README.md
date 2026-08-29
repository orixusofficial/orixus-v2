# Orixus Ultimate Focus — Browser Extension (Manifest V3)

The **Orixus Ultimate Focus Browser Extension** is an independent, local enforcement agent that blocks prohibited domain categories during active focus sessions.

---

## Features
- **Independent Enforcement**: Continues blocking restricted sites even when the Orixus website is completely closed.
- **Offline & Restart Resilient**: Caches focus policy and `expires_at` locally; restores blocking rules automatically on browser restart.
- **Privacy & Security First**: Operates with least-privilege permissions. Uses standard user authentication JWT tokens. Contains **NO service-role keys**.
- **Orixus Block Page**: Presents a clean, flat dark restriction screen when a blocked domain is accessed.

---

## Installation Instructions (Chromium Browsers)

1. Open your Chromium-based browser (Google Chrome, Microsoft Edge, Brave, etc.).
2. Navigate to the extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the `extension` directory located inside your Orixus workspace folder:
   `c:\Users\Asus\.antigravity\orixus\extension`
6. Pin the **Orixus Ultimate Focus** extension to your browser toolbar for quick status access.

---

## Synchronization
- Launch an active session from the Orixus Control Center at `/ultimate-focus`.
- Click **"COMMIT & PROTECT"**.
- The extension automatically receives the active focus policy and applies declarative network blocking rules until `expires_at`.
