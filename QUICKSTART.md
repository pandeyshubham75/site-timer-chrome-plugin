# 🚀 Quick Start Guide

Follow these simple steps to install and use the Site Timer & Blocker extension.

## Step 1: Generate Icon Files

You have three options to generate the required icon files:

### Option A: Use the HTML Generator (Easiest) ✅
1. Open `create-icons.html` in your browser (it should have opened automatically)
2. Click "Download All Icons" button
3. Save all three files to the `icons` folder:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

### Option B: Use Python Script
```bash
pip3 install pillow
python3 generate_icons.py
```

### Option C: Use ImageMagick
```bash
brew install imagemagick
./generate-icons.sh
```

### Option D: Use Your Own Icons
Simply place any 16x16, 48x48, and 128x128 PNG images in the `icons` folder with the correct names.

## Step 2: Install the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select this folder: `site-timer-chrome-plugin`
5. The extension icon should appear in your toolbar!

## Step 3: Start Using

### Block a Website
1. Click the extension icon
2. Enter a URL like `facebook.com`
3. Click "Add" in the Blocked Sites tab
4. Done! That site is now blocked

### Set a Time Limit
1. Click the extension icon
2. Go to "Time Limited" tab
3. Enter URL like `youtube.com`
4. Enter minutes like `30`
5. Click "Add"
6. The site will block after 30 minutes of use today

### View Your Stats
1. Click the extension icon
2. Go to "Stats" tab
3. See all your usage for today

## Tips

- **Enter just the domain**: Use `youtube.com` not `https://youtube.com`
- **Works with subdomains**: Blocking `youtube.com` also blocks `www.youtube.com`
- **Daily reset**: Stats reset automatically at midnight
- **No data sent**: Everything stays on your computer

## Need Help?

Check the full [README.md](README.md) for:
- Detailed documentation
- Troubleshooting
- Technical details
- Customization options

---

**Enjoy your productive browsing! 🎯**
