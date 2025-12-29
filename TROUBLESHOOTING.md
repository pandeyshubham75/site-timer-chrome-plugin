# 🔧 Troubleshooting Guide

## Can't Find the Extension Configuration?

### Step 1: Locate the Extension Icon

After loading the extension, the icon might be hidden. Here's how to find it:

1. **Look for the puzzle piece icon** 🧩 in your Chrome toolbar (top-right corner)
2. Click it to see all your extensions
3. Find **"Site Timer & Blocker"** in the list
4. Click the **pin icon** 📌 next to it to pin it to your toolbar
5. Now click the extension icon to open the configuration popup

### Step 2: Check for Errors

If you still can't access the popup:

1. Go to `chrome://extensions/`
2. Find "Site Timer & Blocker"
3. Check if there's a red **"Errors"** button - if yes:
   - Click "Errors" to see what's wrong
   - Common issues:
     - Missing icon files
     - Syntax errors in JavaScript
     - Permission issues

### Step 3: Inspect the Popup

If the popup appears but is blank or broken:

1. Go to `chrome://extensions/`
2. Find "Site Timer & Blocker"
3. Click **"Inspect views: popup.html"** (appears after you click the extension icon)
4. Check the Console tab for errors

### Step 4: Reload the Extension

After any fixes:

1. Go to `chrome://extensions/`
2. Find "Site Timer & Blocker"
3. Click the **circular reload icon** 🔄
4. Try clicking the extension icon again

## Visual Guide

```
Chrome Toolbar:
┌─────────────────────────────────────────────────┐
│  [Tab 1] [Tab 2]     🧩 [Profile] [⋮]          │
│                       ↑                          │
│                  Click here first!              │
└─────────────────────────────────────────────────┘

Extensions Menu:
┌─────────────────────────────────┐
│  Extensions                     │
│  ─────────────────────────────  │
│  🛡️ Site Timer & Blocker    📌  │  ← Click pin
│  🔧 Other Extension        📌  │
└─────────────────────────────────┘
```

## Common Issues

### Issue: "Errors" button appears

**Solution**: Check the error message and:
- Make sure all files are present
- Reload the extension
- Check file permissions

### Issue: Popup is blank

**Solution**: 
- Inspect the popup (right-click → Inspect)
- Check Console for JavaScript errors
- Make sure popup.html, popup.js, and styles.css are in the root folder

### Issue: Extension doesn't appear at all

**Solution**:
- Make sure you selected the correct folder when loading
- The folder should contain manifest.json
- Reload the extension page

### Issue: Can't block sites

**Solution**:
- Make sure you granted all permissions when loading
- Check that the background service worker is running
- Go to `chrome://extensions/` → Service Worker → Inspect to see logs

## Still Having Issues?

Check the browser console for errors:
1. Right-click the extension icon → Inspect Popup
2. Look at the Console tab
3. Share any error messages for help

## Quick Test

To verify the extension is working:

1. Click the extension icon
2. You should see three tabs: "🚫 Blocked Sites", "⏱️ Time Limited", "📊 Stats"
3. Try adding `example.com` to blocked sites
4. Visit `example.com` - you should be redirected to a blocked page

If this doesn't work, check the steps above!
