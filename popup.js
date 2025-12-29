// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Refresh stats if switching to stats tab
    if (tabName === 'stats') {
      loadStats();
    }
  });
});

// Add blocked site
document.getElementById('add-blocked-btn').addEventListener('click', async () => {
  const input = document.getElementById('blocked-url-input');
  const url = input.value.trim();
  
  if (!url) {
    alert('Please enter a URL');
    return;
  }
  
  const normalizedUrl = normalizeUrl(url);
  const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
  
  if (blockedSites.includes(normalizedUrl)) {
    alert('This site is already blocked');
    return;
  }
  
  blockedSites.push(normalizedUrl);
  await chrome.storage.local.set({ blockedSites });
  
  input.value = '';
  loadBlockedSites();
});

// Add time-limited site
document.getElementById('add-timed-btn').addEventListener('click', async () => {
  const urlInput = document.getElementById('timed-url-input');
  const timeInput = document.getElementById('time-limit-input');
  const url = urlInput.value.trim();
  const minutes = parseInt(timeInput.value);
  
  if (!url) {
    alert('Please enter a URL');
    return;
  }
  
  if (!minutes || minutes < 1) {
    alert('Please enter a valid time limit (1-1440 minutes)');
    return;
  }
  
  const normalizedUrl = normalizeUrl(url);
  const { timeLimitedSites = {} } = await chrome.storage.local.get('timeLimitedSites');
  
  timeLimitedSites[normalizedUrl] = minutes * 60; // Store in seconds
  await chrome.storage.local.set({ timeLimitedSites });
  
  urlInput.value = '';
  timeInput.value = '';
  loadTimeLimitedSites();
});

// Load blocked sites
async function loadBlockedSites() {
  const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
  const list = document.getElementById('blocked-list');
  const empty = document.getElementById('blocked-empty');
  
  list.innerHTML = '';
  
  if (blockedSites.length === 0) {
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  
  blockedSites.forEach(url => {
    const li = document.createElement('li');
    li.className = 'site-item';
    li.innerHTML = `
      <div class="site-info">
        <div class="site-url">${url}</div>
      </div>
      <button class="delete-btn" data-url="${url}">Remove</button>
    `;
    
    li.querySelector('.delete-btn').addEventListener('click', async () => {
      const updatedSites = blockedSites.filter(s => s !== url);
      await chrome.storage.local.set({ blockedSites: updatedSites });
      loadBlockedSites();
    });
    
    list.appendChild(li);
  });
}

// Load time-limited sites
async function loadTimeLimitedSites() {
  const { timeLimitedSites = {}, timeUsage = {} } = await chrome.storage.local.get(['timeLimitedSites', 'timeUsage']);
  const list = document.getElementById('timed-list');
  const empty = document.getElementById('timed-empty');
  
  list.innerHTML = '';
  
  const sites = Object.keys(timeLimitedSites);
  
  if (sites.length === 0) {
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  
  sites.forEach(url => {
    const limitSeconds = timeLimitedSites[url];
    const usedSeconds = timeUsage[url] || 0;
    const limitMinutes = Math.floor(limitSeconds / 60);
    const usedMinutes = Math.floor(usedSeconds / 60);
    const percentage = (usedSeconds / limitSeconds) * 100;
    
    let timeClass = 'time-used';
    if (percentage >= 100) {
      timeClass = 'time-exceeded';
    } else if (percentage >= 80) {
      timeClass = 'time-warning';
    }
    
    const li = document.createElement('li');
    li.className = 'site-item';
    li.innerHTML = `
      <div class="site-info">
        <div class="site-url">${url}</div>
        <div class="site-limit">Limit: ${limitMinutes} min/day</div>
        <div class="${timeClass}">Used: ${usedMinutes} min (${Math.min(percentage, 100).toFixed(0)}%)</div>
      </div>
      <div class="site-actions">
        <button class="edit-btn" data-url="${url}">Edit</button>
        <button class="delete-btn" data-url="${url}">Remove</button>
      </div>
    `;
    
    // Edit button handler
    li.querySelector('.edit-btn').addEventListener('click', () => {
      editTimeLimitedSite(li, url, limitMinutes);
    });
    
    // Delete button handler
    li.querySelector('.delete-btn').addEventListener('click', async () => {
      delete timeLimitedSites[url];
      await chrome.storage.local.set({ timeLimitedSites });
      loadTimeLimitedSites();
    });
    
    list.appendChild(li);
  });
}

// Edit time-limited site
function editTimeLimitedSite(listItem, url, currentMinutes) {
  const timeUsage = listItem.querySelector('.time-used, .time-warning, .time-exceeded');
  const usedText = timeUsage ? timeUsage.textContent : '';
  
  // Replace content with edit form
  listItem.innerHTML = `
    <div class="site-info">
      <div class="site-url">${url}</div>
      <div class="edit-form">
        <input type="number" class="edit-input" value="${currentMinutes}" min="1" max="1440" placeholder="Minutes" />
        <span class="edit-label">min/day</span>
      </div>
      ${timeUsage ? `<div class="${timeUsage.className}">${usedText}</div>` : ''}
    </div>
    <div class="site-actions">
      <button class="save-btn">Save</button>
      <button class="cancel-btn">Cancel</button>
    </div>
  `;
  
  const input = listItem.querySelector('.edit-input');
  input.focus();
  input.select();
  
  // Save button handler
  listItem.querySelector('.save-btn').addEventListener('click', async () => {
    const newMinutes = parseInt(input.value);
    
    if (!newMinutes || newMinutes < 1) {
      alert('Please enter a valid time limit (1-1440 minutes)');
      return;
    }
    
    const { timeLimitedSites = {} } = await chrome.storage.local.get('timeLimitedSites');
    timeLimitedSites[url] = newMinutes * 60; // Store in seconds
    await chrome.storage.local.set({ timeLimitedSites });
    
    loadTimeLimitedSites();
  });
  
  // Cancel button handler
  listItem.querySelector('.cancel-btn').addEventListener('click', () => {
    loadTimeLimitedSites();
  });
  
  // Allow Enter key to save, Escape to cancel
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      listItem.querySelector('.save-btn').click();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      listItem.querySelector('.cancel-btn').click();
    }
  });
}

// Load stats
async function loadStats() {
  const { timeUsage = {}, timeLimitedSites = {} } = await chrome.storage.local.get(['timeUsage', 'timeLimitedSites']);
  const container = document.getElementById('stats-list');
  const empty = document.getElementById('stats-empty');
  
  container.innerHTML = '';
  
  const sites = Object.keys(timeUsage).filter(url => timeUsage[url] > 0);
  
  if (sites.length === 0) {
    empty.style.display = 'block';
    return;
  }
  
  empty.style.display = 'none';
  
  // Sort by usage time (descending)
  sites.sort((a, b) => timeUsage[b] - timeUsage[a]);
  
  sites.forEach(url => {
    const usedSeconds = timeUsage[url];
    const minutes = Math.floor(usedSeconds / 60);
    const seconds = usedSeconds % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    const div = document.createElement('div');
    div.className = 'stat-item';
    
    let progressHtml = '';
    if (timeLimitedSites[url]) {
      const limitSeconds = timeLimitedSites[url];
      const percentage = Math.min((usedSeconds / limitSeconds) * 100, 100);
      let progressClass = '';
      if (percentage >= 100) {
        progressClass = 'exceeded';
      } else if (percentage >= 80) {
        progressClass = 'warning';
      }
      
      progressHtml = `
        <div class="progress-bar">
          <div class="progress-fill ${progressClass}" style="width: ${percentage}%"></div>
        </div>
      `;
    }
    
    div.innerHTML = `
      <div class="stat-url">${url}</div>
      <div class="stat-time">${timeStr}</div>
      <div class="stat-label">Time spent today</div>
      ${progressHtml}
    `;
    
    container.appendChild(div);
  });
}

// Reset stats
document.getElementById('reset-stats-btn').addEventListener('click', async () => {
  if (confirm('Are you sure you want to reset all statistics for today?')) {
    await chrome.storage.local.set({ timeUsage: {}, lastReset: new Date().toDateString() });
    loadStats();
  }
});

// Normalize URL (extract domain)
function normalizeUrl(url) {
  let normalized = url.toLowerCase().trim();
  normalized = normalized.replace(/^https?:\/\//, '');
  normalized = normalized.replace(/^www\./, '');
  normalized = normalized.split('/')[0];
  return normalized;
}

// Format time
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadBlockedSites();
  loadTimeLimitedSites();
});
