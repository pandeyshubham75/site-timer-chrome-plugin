# 🛡️ Site Timer & Blocker

A Chrome extension to help you manage your online time wisely by blocking distracting websites or setting daily time limits.

## ✨ Features

- **🚫 Website Blocking**: Completely block access to distracting websites
- **⏱️ Time Limits**: Set daily time limits for specific websites (e.g., 30 minutes/day on social media)
- **📊 Usage Statistics**: Track how much time you spend on each website
- **🎨 Modern UI**: Beautiful, intuitive interface with a clean design
- **🔒 Privacy First**: All data stored locally on your device
- **⚡ Real-time Tracking**: Accurate time tracking with automatic daily resets

## 📦 Installation

### Install from Source (Developer Mode)

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd site-timer-chrome-plugin
   ```

2. **Generate icon files** (if not already present)
   
   The extension needs PNG icons. You can:
   - Use an online SVG to PNG converter for `icons/icon.svg`
   - Or use ImageMagick (if installed):
   ```bash
   convert icons/icon.svg -resize 16x16 icons/icon16.png
   convert icons/icon.svg -resize 48x48 icons/icon48.png
   convert icons/icon.svg -resize 128x128 icons/icon128.png
   ```
   
   Alternatively, use any 128x128 PNG image and name it as shown above.

3. **Open Chrome and navigate to extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `site-timer-chrome-plugin` folder
   - The extension should now appear in your toolbar!

## 🚀 Usage

### Block a Website

1. Click the extension icon in your toolbar
2. Go to the "🚫 Blocked Sites" tab
3. Enter the website URL (e.g., `facebook.com` or `twitter.com`)
4. Click "Add"
5. The site will be immediately blocked

### Set a Time Limit

1. Click the extension icon
2. Go to the "⏱️ Time Limited" tab
3. Enter the website URL (e.g., `youtube.com`)
4. Enter the daily time limit in minutes (e.g., `30` for 30 minutes)
5. Click "Add"
6. The extension will track your usage and block the site when you reach the limit

### View Statistics

1. Click the extension icon
2. Go to the "📊 Stats" tab
3. See your daily usage for all tracked websites
4. Statistics reset automatically at midnight
5. Click "Reset Today's Stats" to manually reset if needed

### Remove a Block or Limit

1. Open the extension
2. Find the site in either the "Blocked Sites" or "Time Limited" tab
3. Click the "Remove" button next to the site

## 🎯 Use Cases

- **Students**: Block social media during study hours
- **Professionals**: Limit time on news sites during work
- **Anyone**: Reduce phone/computer addiction by setting boundaries
- **Parents**: Help children manage screen time (when they use your profile)

## 🔧 How It Works

- **Background Service Worker**: Tracks active tabs and time spent
- **Storage API**: All data stored locally using Chrome's storage API
- **Web Navigation API**: Intercepts navigation to blocked sites
- **Daily Reset**: Automatically resets time usage at midnight

## 📝 Technical Details

### File Structure

```
site-timer-chrome-plugin/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── styles.css            # Popup styles
├── background.js         # Background service worker
├── blocked.html          # Page shown when site is blocked
├── blocked.js            # Blocked page logic
├── icons/                # Extension icons
│   ├── icon.svg
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

### Permissions Used

- `storage`: Store blocked sites, time limits, and usage data
- `tabs`: Access tab information for time tracking
- `alarms`: Schedule daily resets (currently using setInterval)
- `webNavigation`: Intercept navigation to blocked sites
- `<all_urls>`: Monitor all websites for time tracking

### Data Storage

All data is stored locally using `chrome.storage.local`:

```javascript
{
  blockedSites: ["facebook.com", "twitter.com"],
  timeLimitedSites: {
    "youtube.com": 1800,  // 30 minutes in seconds
    "reddit.com": 600     // 10 minutes in seconds
  },
  timeUsage: {
    "youtube.com": 1234,  // seconds used today
    "reddit.com": 456
  },
  lastReset: "2024-01-15"  // last reset date
}
```

## 🎨 Customization

### Modify Colors

Edit the gradient colors in `styles.css` and `blocked.html`:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Add More Productivity Tips

Edit the `tips` array in `blocked.js`:

```javascript
const tips = [
  "Your custom tip here",
  // ... more tips
];
```

### Change Time Tracking Interval

In `background.js`, modify the interval (default: 1 second):

```javascript
updateInterval = setInterval(async () => {
  await updateTimeUsage();
}, 1000); // milliseconds
```

## 🐛 Troubleshooting

### Extension not blocking sites

- Make sure you entered just the domain (e.g., `youtube.com`, not `https://youtube.com`)
- Check that the extension has the required permissions
- Try reloading the extension at `chrome://extensions/`

### Time tracking not working

- Ensure the tab is active and in focus
- The extension only tracks time when Chrome is the active window
- Check the console for errors: Right-click extension → Inspect popup

### Statistics not resetting

- The extension resets stats at midnight based on your local timezone
- You can manually reset by clicking "Reset Today's Stats"

## 🔐 Privacy

This extension:
- ✅ Stores all data locally on your device
- ✅ Does NOT send any data to external servers
- ✅ Does NOT track your browsing history
- ✅ Only monitors sites you explicitly add to the block/limit lists
- ✅ Open source - you can inspect all code

## 🚧 Future Enhancements

Potential features for future versions:

- [ ] Schedule-based blocking (e.g., block during work hours)
- [ ] Custom block page messages
- [ ] Export/import settings
- [ ] Password protection
- [ ] Weekly/monthly statistics
- [ ] Break reminders
- [ ] Focus mode (block multiple sites at once)
- [ ] Whitelist mode (only allow specific sites)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 💡 Tips for Best Results

1. **Be Realistic**: Start with reasonable time limits
2. **Review Regularly**: Check your stats weekly to adjust limits
3. **Use Blocking Wisely**: Block sites during specific times/tasks
4. **Combine Strategies**: Use both blocking and time limits
5. **Stay Consistent**: Discipline builds over time

---

**Made with ❤️ to help you stay focused and productive!**
