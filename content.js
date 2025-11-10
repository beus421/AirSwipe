// console.log("Manga Gesture Reader: Content script loaded");

let gestureEnabled = false;
let videoElement = null;
let canvasElement = null;
let stream = null;
let mediaPipeReady = false;

// Settings
let settings = {
  scrollSpeed: 1.0,
  scrollDistance: 80,
  showCamera: true,
  showIndicator: true
};

// Inject MediaPipe loader script into the page context
function injectMediaPipeScript() {
  return new Promise((resolve, reject) => {
    // Check if already injected (look for the script tag)
    if (document.querySelector('script[src*="mediapipe-loader.js"]')) {
      // Wait a bit for it to initialize
      setTimeout(() => {
        mediaPipeReady = true;
        resolve(true);
      }, 500);
      return;
    }
    
    // Create script element that loads from extension
    const script = document.createElement('script');
    script.type = 'module';
    script.src = chrome.runtime.getURL('mediapipe-loader.js');
    
    document.head.appendChild(script);
    
    // Listen for ready event
    const readyHandler = () => {
    //   console.log("MediaPipe ready in content script!");
      mediaPipeReady = true;
      window.removeEventListener('mediapipe-ready', readyHandler);
      window.removeEventListener('mediapipe-error', errorHandler);
      resolve(true);
    };
    
    const errorHandler = (e) => {
      console.error("MediaPipe error event:", e.detail);
      window.removeEventListener('mediapipe-ready', readyHandler);
      window.removeEventListener('mediapipe-error', errorHandler);
      reject(new Error(e.detail));
    };
    
    window.addEventListener('mediapipe-ready', readyHandler);
    window.addEventListener('mediapipe-error', errorHandler);
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!mediaPipeReady) {
        window.removeEventListener('mediapipe-ready', readyHandler);
        window.removeEventListener('mediapipe-error', errorHandler);
        reject(new Error("MediaPipe loading timeout"));
      }
    }, 30000);
  });
}

// Listen for gesture events from page context
window.addEventListener('gesture-detected', (e) => {
  const { gesture, confidence } = e.detail;
  handleGesture(gesture, confidence);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleGestures") {
    gestureEnabled = request.enabled;
    
    // Update settings if provided
    if (request.settings) {
      settings = { ...settings, ...request.settings };
    }
    
    if (gestureEnabled) {
      startCamera();
    } else {
      stopCamera();
    }
    
    sendResponse({ success: true });
  } else if (request.action === "updateSettings") {
    // Update settings while running
    settings = { ...settings, ...request.settings };
    updateCameraVisibility();
    sendResponse({ success: true });
  }
  return true;
});

async function startCamera() {
//   console.log("Starting camera...");
  
  // Show loading message
  showGestureIndicator("Loading MediaPipe... ⏳");
  
  try {
    // Load MediaPipe if not already loaded
    if (!mediaPipeReady) {
      await injectMediaPipeScript();
    }
    
    // Create video element for webcam with unique ID
    videoElement = document.createElement('video');
    videoElement.id = 'gesture-video-' + Date.now();
    videoElement.style.position = 'fixed';
    videoElement.style.top = '10px';
    videoElement.style.right = '10px';
    videoElement.style.width = '320px';
    videoElement.style.height = '240px';
    videoElement.style.zIndex = '10000';
    videoElement.style.border = '2px solid #00ff00';
    videoElement.style.borderRadius = '8px';
    videoElement.style.background = 'black';
    videoElement.playsInline = true;
    videoElement.muted = true;
    document.body.appendChild(videoElement);
    
    // Create canvas for drawing hand landmarks with unique ID
    canvasElement = document.createElement('canvas');
    canvasElement.id = 'gesture-canvas-' + Date.now();
    canvasElement.style.position = 'fixed';
    canvasElement.style.top = '10px';
    canvasElement.style.right = '10px';
    canvasElement.style.width = '320px';
    canvasElement.style.height = '240px';
    canvasElement.style.zIndex = '10001';
    canvasElement.width = 640;
    canvasElement.height = 480;
    document.body.appendChild(canvasElement);
    
    // Request webcam access
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 }
      } 
    });
    
    videoElement.srcObject = stream;
    await videoElement.play();
    
    // Start gesture recognition in page context by sending event with element IDs
    window.dispatchEvent(new CustomEvent('start-gesture-recognition', {
      detail: {
        videoId: videoElement.id,
        canvasId: canvasElement.id
      }
    }));
    
    // Apply initial camera visibility setting
    updateCameraVisibility();
    
    showGestureIndicator("✅ Gesture Control Active!");
    // console.log("Camera started with gesture recognition!");
    
  } catch (err) {
    console.error("Error starting camera:", err);
    alert("Failed to start gesture control!\n\nError: " + err.message);
    stopCamera();
  }
}

function handleGesture(gestureName, confidence) {
  if (!gestureEnabled) return; // Extra safety check
  
//   console.log(`Gesture detected: ${gestureName} (${(confidence * 100).toFixed(0)}%)`);
  
  // Calculate scroll amount based on settings
  const baseDistance = window.innerHeight * (settings.scrollDistance / 100);
  
  // Map gestures to actions
  switch(gestureName) {
    case 'Thumb_Up':
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showGestureIndicator('👍 Scroll to Top', 500);
      break;
    case 'Thumb_Down':
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      showGestureIndicator('👎 Scroll to Bottom', 500);
      break;
    case 'Open_Palm':
      showGestureIndicator('✋ Open Palm', 300);
      break;
    case 'Closed_Fist':
        scrollPage(baseDistance);
      showGestureIndicator('✊ Fist', 300);
      break;
    case 'Victory':
      showGestureIndicator('✌️ Scroll Down', 500);
      break;
    case 'Pointing_Up':
      scrollPage(-baseDistance);
      showGestureIndicator('☝️ Scroll Up', 500);
      break;
    case 'ILoveYou':
      showGestureIndicator('🤟 I Love You!', 500);
      break;
  }
}

function stopCamera() {
//   console.log("Stopping camera...");
  
  // Stop gesture recognition in page context
  window.dispatchEvent(new CustomEvent('stop-gesture-recognition'));
  
  // Stop camera stream
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
    //   console.log("Stopped track:", track.kind);
    });
    stream = null;
  }
  
  // Remove video element
  if (videoElement) {
    videoElement.srcObject = null;
    videoElement.remove();
    videoElement = null;
  }
  
  // Remove canvas element
  if (canvasElement) {
    canvasElement.remove();
    canvasElement = null;
  }
  
  // Remove any gesture indicators
  const indicator = document.getElementById('gesture-indicator');
  if (indicator) {
    indicator.remove();
  }
  
//   console.log("Camera stopped and cleaned up");
}

function scrollPage(amount) {
  // Apply speed multiplier - for smooth scrolling, we adjust the distance
  const adjustedAmount = amount * settings.scrollSpeed;
  
  window.scrollBy({
    top: adjustedAmount,
    behavior: 'smooth'
  });
}

function updateCameraVisibility() {
  if (!videoElement || !canvasElement) return;
  
  const display = settings.showCamera ? 'block' : 'none';
  videoElement.style.display = display;
  canvasElement.style.display = display;
  
  // Notify mediapipe loader about visibility change
  window.dispatchEvent(new CustomEvent('update-camera-visibility', {
    detail: { showCamera: settings.showCamera }
  }));
}

function showGestureIndicator(text, duration = 1000) {
  // Check if indicator should be shown
  if (!settings.showIndicator) return;
  
  // Remove any existing indicator first
  const existing = document.getElementById('gesture-indicator');
  if (existing) existing.remove();
  
  const indicator = document.createElement('div');
  indicator.id = 'gesture-indicator';
  indicator.textContent = text;
  indicator.style.position = 'fixed';
  indicator.style.top = '20px';
  indicator.style.right = '350px';
  indicator.style.transform = 'translateX(0)';
  indicator.style.background = 'rgba(0, 255, 0, 0.7)';
  indicator.style.color = 'white';
  indicator.style.padding = '12px 20px';
  indicator.style.borderRadius = '8px';
  indicator.style.fontSize = '16px';
  indicator.style.zIndex = '10002';
  indicator.style.fontWeight = 'bold';
  indicator.style.transition = 'opacity 0.3s';
  indicator.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  document.body.appendChild(indicator);
  
  setTimeout(() => {
    indicator.style.opacity = '0';
    setTimeout(() => indicator.remove(), 300);
  }, duration);
}