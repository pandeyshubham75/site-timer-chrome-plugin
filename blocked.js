// Productivity tips
const tips = [
  "Take a 5-minute break to stretch and rest your eyes. Your body will thank you!",
  "Try the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break.",
  "Drink a glass of water. Staying hydrated improves focus and productivity.",
  "Use this time to tackle a task from your to-do list instead.",
  "Consider taking a short walk. Physical activity boosts mental clarity.",
  "Practice deep breathing for 2 minutes to reduce stress and refocus.",
  "Write down three things you want to accomplish today.",
  "Use this moment to organize your workspace for better productivity.",
  "Reflect on your goals. Are your daily actions aligned with them?",
  "Remember: discipline is choosing between what you want now and what you want most."
];

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const blockedUrl = urlParams.get('url');
const reason = urlParams.get('reason');
const domain = urlParams.get('domain');

// Update UI based on reason
async function initialize() {
  document.getElementById('url').textContent = blockedUrl;
  
  if (reason === 'time-limit') {
    document.getElementById('icon').textContent = '⏰';
    document.getElementById('title').textContent = 'Time Limit Reached';
    document.getElementById('message').textContent = 'You have reached your daily time limit for this website';
    
    // Show stats
    const statsDiv = document.getElementById('stats');
    statsDiv.style.display = 'block';
    
    // Load time statistics
    const { timeUsage = {}, timeLimitedSites = {} } = await chrome.storage.local.get(['timeUsage', 'timeLimitedSites']);
    const usedSeconds = timeUsage[domain] || 0;
    const limitSeconds = timeLimitedSites[domain] || 0;
    
    const usedMinutes = Math.floor(usedSeconds / 60);
    const limitMinutes = Math.floor(limitSeconds / 60);
    const percentage = Math.min((usedSeconds / limitSeconds) * 100, 100);
    
    document.getElementById('time-used').textContent = formatTime(usedSeconds);
    document.getElementById('time-limit').textContent = formatTime(limitSeconds);
    document.getElementById('progress').style.width = percentage + '%';
  } else {
    document.getElementById('icon').textContent = '🚫';
    document.getElementById('title').textContent = 'Site Blocked';
    document.getElementById('message').textContent = 'This website has been blocked by Site Timer & Blocker';
  }
  
  // Show random productivity tip
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  document.getElementById('tip').textContent = randomTip;
}

// Format time
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

// Go back button
document.getElementById('go-back').addEventListener('click', () => {
  window.history.back();
});

// Manage settings button
document.getElementById('manage').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Initialize
initialize();
