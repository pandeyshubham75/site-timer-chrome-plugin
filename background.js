// Track active tab and time
let activeTabId = null;
let activeUrl = null;
let startTime = null;
let updateInterval = null;

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('Site Timer & Blocker installed');
  initializeStorage();
});

// Initialize storage
async function initializeStorage() {
  const data = await chrome.storage.local.get(['blockedSites', 'timeLimitedSites', 'timeUsage', 'lastReset']);
  
  if (!data.blockedSites) {
    await chrome.storage.local.set({ blockedSites: [] });
  }
  
  if (!data.timeLimitedSites) {
    await chrome.storage.local.set({ timeLimitedSites: {} });
  }
  
  if (!data.timeUsage) {
    await chrome.storage.local.set({ timeUsage: {} });
  }
  
  if (!data.lastReset) {
    await chrome.storage.local.set({ lastReset: new Date().toDateString() });
  }
  
  // Check if we need to reset daily stats
  await checkDailyReset();
}

// Check and reset daily stats
async function checkDailyReset() {
  const { lastReset } = await chrome.storage.local.get('lastReset');
  const today = new Date().toDateString();
  
  if (lastReset !== today) {
    await chrome.storage.local.set({
      timeUsage: {},
      lastReset: today
    });
    console.log('Daily stats reset');
  }
}

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    await handleTabChange(activeInfo.tabId);
  } catch (error) {
    // Tab may have been closed, ignore
    console.error('Error handling tab activation:', error);
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    try {
      await handleTabChange(tabId);
    } catch (error) {
      // Tab may have been closed, ignore
      console.error('Error handling tab update:', error);
    }
  }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    stopTracking();
  } else {
    // Browser gained focus
    try {
      const [tab] = await chrome.tabs.query({ active: true, windowId: windowId });
      if (tab) {
        await handleTabChange(tab.id);
      }
    } catch (error) {
      // Window may have been closed, ignore
    }
  }
});

// Handle tab change
async function handleTabChange(tabId) {
  // Stop tracking previous tab
  stopTracking();
  
  // Get new tab info
  let tab;
  try {
    tab = await chrome.tabs.get(tabId);
  } catch (error) {
    // Tab may have been closed, ignore
    return;
  }
  
  if (!tab || !tab.url) {
    return;
  }
  
  const url = extractDomain(tab.url);
  
  // Skip chrome:// and extension pages
  if (!url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Check if site is blocked
  const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
  if (isBlocked(url, blockedSites)) {
    await redirectToBlockedPage(tabId, url, 'blocked');
    return;
  }
  
  // Check if site has exceeded time limit
  const { timeLimitedSites = {}, timeUsage = {} } = await chrome.storage.local.get(['timeLimitedSites', 'timeUsage']);
  const limit = getMatchingLimit(url, timeLimitedSites);
  
  if (limit) {
    const used = timeUsage[limit.domain] || 0;
    if (used >= limit.seconds) {
      await redirectToBlockedPage(tabId, url, 'time-limit', limit.domain);
      return;
    }
  }
  
  // Start tracking time for this tab
  startTracking(tabId, url);
}

// Start tracking time
function startTracking(tabId, url) {
  activeTabId = tabId;
  activeUrl = url;
  startTime = Date.now();
  
  // Update every second
  updateInterval = setInterval(async () => {
    await updateTimeUsage();
  }, 1000);
}

// Stop tracking time
function stopTracking() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  
  if (activeUrl && startTime) {
    // Save final time
    updateTimeUsage();
  }
  
  activeTabId = null;
  activeUrl = null;
  startTime = null;
}

// Update time usage
async function updateTimeUsage() {
  if (!activeUrl || !startTime) {
    return;
  }
  
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  
  if (elapsed === 0) {
    return;
  }
  
  // Get current usage
  const { timeUsage = {}, timeLimitedSites = {} } = await chrome.storage.local.get(['timeUsage', 'timeLimitedSites']);
  
  // Find matching domain for time limits
  const limit = getMatchingLimit(activeUrl, timeLimitedSites);
  const trackingDomain = limit ? limit.domain : activeUrl;
  
  // Update usage
  timeUsage[trackingDomain] = (timeUsage[trackingDomain] || 0) + elapsed;
  await chrome.storage.local.set({ timeUsage });
  
  // Reset start time
  startTime = Date.now();
  
  // Check if limit exceeded
  if (limit && timeUsage[trackingDomain] >= limit.seconds) {
    const tabIdToBlock = activeTabId;
    const urlToBlock = activeUrl;
    stopTracking();
    if (tabIdToBlock) {
      await redirectToBlockedPage(tabIdToBlock, urlToBlock, 'time-limit', trackingDomain);
    }
  }
}

// Check if URL is blocked
function isBlocked(url, blockedSites) {
  if (!url) return false;
  return blockedSites.some(blocked => {
    // Exact match
    if (url === blocked) return true;
    // Subdomain match (e.g., blocked="example.com" matches "sub.example.com")
    if (url.endsWith('.' + blocked)) return true;
    return false;
  });
}

// Get matching time limit
function getMatchingLimit(url, timeLimitedSites) {
  if (!url) return null;
  for (const [domain, seconds] of Object.entries(timeLimitedSites)) {
    // Exact match
    if (url === domain) return { domain, seconds };
    // Subdomain match (e.g., domain="example.com" matches "sub.example.com")
    if (url.endsWith('.' + domain)) return { domain, seconds };
  }
  return null;
}

// Extract domain from URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname.toLowerCase();
    hostname = hostname.replace(/^www\./, '');
    return hostname;
  } catch {
    return null;
  }
}

// Redirect to blocked page
async function redirectToBlockedPage(tabId, url, reason, domain = url) {
  const blockedPageUrl = chrome.runtime.getURL('blocked.html') + 
    `?url=${encodeURIComponent(url)}&reason=${reason}&domain=${encodeURIComponent(domain)}`;
  
  try {
    await chrome.tabs.update(tabId, { url: blockedPageUrl });
  } catch (error) {
    console.error('Failed to redirect:', error);
  }
}

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  try {
    if (details.frameId !== 0) {
      return; // Only handle main frame
    }
    
    const url = extractDomain(details.url);
    
    if (!url || details.url.startsWith('chrome://') || details.url.startsWith('chrome-extension://')) {
      return;
    }
    
    // Check blocked sites
    const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
    if (isBlocked(url, blockedSites)) {
      await redirectToBlockedPage(details.tabId, url, 'blocked');
      return;
    }
    
    // Check time limits
    const { timeLimitedSites = {}, timeUsage = {} } = await chrome.storage.local.get(['timeLimitedSites', 'timeUsage']);
    const limit = getMatchingLimit(url, timeLimitedSites);
    
    if (limit) {
      const used = timeUsage[limit.domain] || 0;
      if (used >= limit.seconds) {
        await redirectToBlockedPage(details.tabId, url, 'time-limit', limit.domain);
      }
    }
  } catch (error) {
    // Tab may have been closed during navigation, ignore
    console.error('Error handling navigation:', error);
  }
});

// Check daily reset every hour
setInterval(checkDailyReset, 60 * 60 * 1000);

// Initialize
initializeStorage();
