# Site Timer & Blocker - Copilot Instructions

## Project Context
This is a **Chrome Extension (Manifest V3)** designed to block distracting websites and enforce time limits. It is a "vanilla" JavaScript project without a build step (Webpack/Vite), TypeScript, or npm dependencies (no `package.json`).

## Architecture & Data Flow
- **Entry Points**:
  - `manifest.json`: Configuration source.
  - `background.js`: Service Worker. The "brain" of the extension. Runs persistently to track active tabs, calculate usage time, and enforce blocks.
  - `popup.html` / `popup.js`: User Interface. Reads/Writes configuration to storage.
  - `blocked.html` / `blocked.js`: The landing page when a user attempts to visit a restricted site.

- **Storage Model (`chrome.storage.local`)**:
  - `blockedSites`: Array of strings (domains).
  - `timeLimitedSites`: Object `{ "domain.com": seconds_allowed }`. **Note:** Time is stored in seconds.
  - `timeUsage`: Object `{ "domain.com": seconds_used }`. **Note:** Reset daily by `checkDailyReset`.
  - `lastReset`: Date string to trigger daily resets.

- **Blocking Mechanism**:
  - Instead of `declarativeNetRequest`, this extension uses `tabs.update` to redirect users to `blocked.html`.
  - `blocked.html` receives context via URL parameters: `?url=...&reason=...&domain=...`.

## Critical Developer Workflows
- **Running the Extension**:
  - Load via `chrome://extensions/` -> "Load unpacked".
  - **Important**: Any change to `background.js` requires clicking the "Reload" icon on the extension card in `chrome://extensions/`. Changes to `popup.html/js` apply immediately on next open.
- **Icon Generation**:
  - Icons are generated from `icons/icon.svg` (assumed source) or manually.
  - Use `python3 generate_icons.py` (requires Pillow) OR `./generate-icons.sh` (requires ImageMagick) to regenerate `icons/icon{16,48,128}.png`.
  - Do not edit PNG files directly.

## Conventions & Patterns
- **Time Units**: Always use **seconds** for internal logic and storage. Convert to minutes/hours only for display.
- **Domain Matching**:
  - Use `extractDomain()` (in `background.js`) or `normalizeUrl()` (in `popup.js`) to strip protocols and paths.
  - Store domains without `www.` prefix for consistency if possible, or handle fuzzy matching.
- **Asynchronous Storage**:
  - All storage operations are async. Use `await chrome.storage.local.get(...)` and `await chrome.storage.local.set(...)`.
- **Debugging**:
  - Use `console.log` freely.
  - Logs for `background.js` appear in the **Service Worker** DevTools (click "service worker" in `chrome://extensions/`).
  - Logs for `popup.js` appear in the **Popup** DevTools (Right-click popup -> Inspect).

## Files of Interest
- `background.js`: Contains the main timer loop (`setInterval` inside `startTracking`), tab listeners, and the daily reset logic.
- `blocked.js`: Rendering logic for the "Time Limit Reached" vs "Site Blocked" screens.
