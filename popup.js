// Default settings
const defaultSettings = {
  enabled: false,
  scrollSpeed: 1.0,
  scrollDistance: 80,
  showCamera: true,
  showIndicator: true
};

let currentSettings = { ...defaultSettings };

// Load settings from storage on popup open
chrome.storage.local.get(['gestureSettings'], (result) => {
  if (result.gestureSettings) {
    currentSettings = { ...defaultSettings, ...result.gestureSettings };
  }
  initializeUI();
});

function initializeUI() {
  // Set UI values from current settings
  document.getElementById('scrollSpeed').value = currentSettings.scrollSpeed;
  document.getElementById('scrollDistance').value = currentSettings.scrollDistance;
  document.getElementById('showCamera').checked = currentSettings.showCamera;
  document.getElementById('showIndicator').checked = currentSettings.showIndicator;
  
  // Update display values
  updateSliderDisplays();
  updateUI();
  
  // Add event listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Toggle button
  document.getElementById('toggleBtn').addEventListener('click', async () => {
    currentSettings.enabled = !currentSettings.enabled;
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.tabs.sendMessage(
        tab.id,
        { 
          action: 'toggleGestures', 
          enabled: currentSettings.enabled,
          settings: currentSettings
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            alert('Error: Content script not loaded. Please refresh the page and try again.');
            currentSettings.enabled = false;
            updateUI();
            saveSettings();
            return;
          }
          
          if (response && response.success) {
            updateUI();
            saveSettings();
          } else {
            alert('Failed to toggle gestures');
            currentSettings.enabled = false;
            updateUI();
            saveSettings();
          }
        }
      );
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
      currentSettings.enabled = false;
      updateUI();
      saveSettings();
    }
  });
  
  // Scroll speed slider
  document.getElementById('scrollSpeed').addEventListener('input', (e) => {
    currentSettings.scrollSpeed = parseFloat(e.target.value);
    updateSliderDisplays();
    saveSettings();
    sendSettingsUpdate();
  });
  
  // Scroll distance slider
  document.getElementById('scrollDistance').addEventListener('input', (e) => {
    currentSettings.scrollDistance = parseInt(e.target.value);
    updateSliderDisplays();
    saveSettings();
    sendSettingsUpdate();
  });
  
  // Camera view toggle
  document.getElementById('showCamera').addEventListener('change', (e) => {
    currentSettings.showCamera = e.target.checked;
    saveSettings();
    sendSettingsUpdate();
  });
  
  // Indicator toggle
  document.getElementById('showIndicator').addEventListener('change', (e) => {
    currentSettings.showIndicator = e.target.checked;
    saveSettings();
    sendSettingsUpdate();
  });
}

function updateSliderDisplays() {
  document.getElementById('speedValue').textContent = currentSettings.scrollSpeed.toFixed(1) + 'x';
  document.getElementById('distanceValue').textContent = currentSettings.scrollDistance + '%';
}

function updateUI() {
  const btn = document.getElementById('toggleBtn');
  
  if (currentSettings.enabled) {
    btn.textContent = '\uD83D\uDC41\uFE0F'; // 👁️ Eye (watching)
    btn.classList.add('active');
  } else {
    btn.textContent = '\uD83D\uDE34'; // 😴 Sleeping face (not watching)
    btn.classList.remove('active');
  }
}

function saveSettings() {
  chrome.storage.local.set({ gestureSettings: currentSettings });
}

async function sendSettingsUpdate() {
  // Only send updates if gestures are currently enabled
  if (!currentSettings.enabled) return;
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(
      tab.id,
      { 
        action: 'updateSettings',
        settings: currentSettings
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error('Error sending settings update:', chrome.runtime.lastError);
        }
      }
    );
  } catch (error) {
    console.error('Error sending settings update:', error);
  }
}