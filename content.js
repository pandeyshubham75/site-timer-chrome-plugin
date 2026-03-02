let countdownEl = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'showCountdown') {
    showOrUpdateCountdown(message.secondsLeft);
  }
});

function showOrUpdateCountdown(secondsLeft) {
  if (secondsLeft <= 0) {
    removeWidget();
    return;
  }

  if (!countdownEl) {
    createWidget(secondsLeft);
  } else {
    setSeconds(secondsLeft);
  }
}

function createWidget(secondsLeft) {
  if (!document.getElementById('__stb_styles__')) {
    const style = document.createElement('style');
    style.id = '__stb_styles__';
    style.textContent = `
      #__stb_widget__ {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        animation: stb_slide_in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        pointer-events: none;
      }
      #__stb_widget__ .stb_inner {
        background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
        color: white;
        padding: 14px 22px;
        border-radius: 14px;
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.45), 0 2px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        min-width: 180px;
      }
      #__stb_widget__ .stb_label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        opacity: 0.9;
        margin-bottom: 6px;
      }
      #__stb_widget__ .stb_seconds {
        font-size: 42px;
        font-weight: 700;
        line-height: 1;
        letter-spacing: -1px;
        margin-bottom: 4px;
      }
      #__stb_widget__ .stb_sublabel {
        font-size: 11px;
        opacity: 0.82;
      }
      #__stb_widget__.stb_urgent .stb_inner {
        animation: stb_pulse 0.55s ease-in-out infinite alternate;
      }
      @keyframes stb_slide_in {
        from { transform: translateX(calc(100% + 32px)); opacity: 0; }
        to   { transform: translateX(0); opacity: 1; }
      }
      @keyframes stb_pulse {
        from { transform: scale(1);    box-shadow: 0 8px 32px rgba(239, 68, 68, 0.45), 0 2px 8px rgba(0,0,0,0.2); }
        to   { transform: scale(1.05); box-shadow: 0 14px 44px rgba(239, 68, 68, 0.7), 0 4px 14px rgba(0,0,0,0.3); }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  countdownEl = document.createElement('div');
  countdownEl.id = '__stb_widget__';
  countdownEl.innerHTML = `
    <div class="stb_inner">
      <div class="stb_label">⏰ Time Limit</div>
      <div class="stb_seconds" id="__stb_seconds__">${secondsLeft}s</div>
      <div class="stb_sublabel">remaining on this site</div>
    </div>
  `;
  document.body.appendChild(countdownEl);
  setSeconds(secondsLeft);
}

function setSeconds(secondsLeft) {
  const el = document.getElementById('__stb_seconds__');
  if (el) {
    el.textContent = `${Math.max(0, secondsLeft)}s`;
  }

  if (countdownEl) {
    if (secondsLeft <= 10) {
      countdownEl.classList.add('stb_urgent');
    } else {
      countdownEl.classList.remove('stb_urgent');
    }
  }
}

function removeWidget() {
  if (countdownEl) {
    countdownEl.remove();
    countdownEl = null;
  }
  const styles = document.getElementById('__stb_styles__');
  if (styles) {
    styles.remove();
  }
}
