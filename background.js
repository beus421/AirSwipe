// background.js - Service worker that manages offscreen document

let creating; // Track if offscreen document is being created

// Create offscreen document if it doesn't exist
async function setupOffscreenDocument(path) {
  // Check if offscreen document already exists
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'],
    documentUrls: [chrome.runtime.getURL(path)]
  });
  
  if (existingContexts.length > 0) {
    return;
  }
  
  // Create offscreen document
  if (creating) {
    await creating;
  } else {
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ['USER_MEDIA'],  // For camera access
      justification: 'Hand gesture recognition using MediaPipe'
    });
    
    await creating;
    creating = null;
  }
}

// Close offscreen document
async function closeOffscreenDocument() {
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT']
  });
  
  if (existingContexts.length > 0) {
    await chrome.offscreen.closeDocument();
  }
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[Background] Received message:", message.type || message.action, "from:", sender.url || sender.tab?.url);
  
  if (message.action === "toggleGestures") {
    // Message from popup to content script - just forward it
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    });
    sendResponse({ success: true });
    return true;
  }
  
  switch (message.type) {
    case 'START_GESTURES':
      handleStartGestures(message, sendResponse);
      return true;  // Keep channel open for async response
      
    case 'STOP_GESTURES':
      handleStopGestures(message, sendResponse);
      return true;
      
    case 'GESTURE_DETECTED':
      // Forward gesture to content script
      if (sender.url && sender.url.includes('offscreen.html')) {
        forwardGestureToActiveTab(message);
      }
      sendResponse({ success: true });
      return true;
      
    case 'INIT_MEDIAPIPE':
    case 'START_CAMERA':
    case 'STOP_CAMERA':
      // These messages should be handled by offscreen document
      // If we receive them here, it means they weren't sent to offscreen
      console.error("[Background] Received offscreen message at background - routing error!");
      sendResponse({ success: false, error: 'Message routing error' });
      return true;
      
    default:
      console.warn("[Background] Unknown message type:", message.type);
      sendResponse({ success: false, error: 'Unknown message type' });
      return true;
  }
});

// Handle start gestures request
async function handleStartGestures(message, sendResponse) {
  try {
    console.log("[Background] Starting gestures...");
    
    // Setup offscreen document
    await setupOffscreenDocument('offscreen.html');
    
    // Wait longer for document to fully load and initialize
    console.log("[Background] Waiting for offscreen document to initialize...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Initialize MediaPipe
    console.log("[Background] Initializing MediaPipe...");
    const initResponse = await chrome.runtime.sendMessage({ type: 'INIT_MEDIAPIPE' });
    console.log("[Background] Init response:", initResponse);
    
    if (!initResponse || !initResponse.success) {
      throw new Error(initResponse?.error || 'Failed to initialize MediaPipe');
    }
    
    // Start camera
    console.log("[Background] Starting camera...");
    const cameraResponse = await chrome.runtime.sendMessage({ type: 'START_CAMERA' });
    console.log("[Background] Camera response:", cameraResponse);
    
    if (!cameraResponse || !cameraResponse.success) {
      throw new Error(cameraResponse?.error || 'Failed to start camera');
    }
    
    console.log("[Background] Gestures started successfully!");
    sendResponse({ success: true });
  } catch (error) {
    console.error("[Background] Error starting gestures:", error);
    console.error("[Background] Error stack:", error.stack);
    sendResponse({ success: false, error: error.message });
  }
}

// Handle stop gestures request
async function handleStopGestures(message, sendResponse) {
  try {
    console.log("[Background] Stopping gestures...");
    
    // Stop camera in offscreen document
    await chrome.runtime.sendMessage({ type: 'STOP_CAMERA' });
    
    // Close offscreen document
    await closeOffscreenDocument();
    
    console.log("[Background] Gestures stopped successfully!");
    sendResponse({ success: true });
  } catch (error) {
    console.error("[Background] Error stopping gestures:", error);
    sendResponse({ success: false, error: error.message });
  }
}

// Forward gesture to active tab's content script
function forwardGestureToActiveTab(message) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'GESTURE_DETECTED',
        gesture: message.gesture,
        confidence: message.confidence
      }).catch(err => console.error("[Background] Error forwarding gesture:", err));
    }
  });
}

// Log initialization
console.log("[Background] Service worker initialized");
console.log("[Background] Chrome version:", navigator.userAgent);
console.log("[Background] Offscreen API available:", !!chrome.offscreen);

// Test that we can create offscreen document
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Background] Extension installed/updated");
});

