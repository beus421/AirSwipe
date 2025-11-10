// offscreen.js - Runs MediaPipe in an offscreen document
import { GestureRecognizer, FilesetResolver } from './lib/mediapipe/tasks-vision.js';

let gestureRecognizer = null;
let videoElement = null;
let canvasElement = null;
let isRunning = false;
let stream = null;
let lastGestureTime = 0;
const GESTURE_COOLDOWN = 1000;

// Initialize MediaPipe
async function initializeMediaPipe() {
  try {
    console.log("[Offscreen] Initializing MediaPipe...");
    
    // Get the base URL for the extension
    const wasmPath = chrome.runtime.getURL("lib/mediapipe/wasm");
    const modelPath = chrome.runtime.getURL("lib/mediapipe/models/gesture_recognizer.task");
    
    console.log("[Offscreen] WASM path:", wasmPath);
    console.log("[Offscreen] Model path:", modelPath);
    
    // Initialize vision tasks with WASM files
    const vision = await FilesetResolver.forVisionTasks(wasmPath);
    
    console.log("[Offscreen] FilesetResolver initialized");
    
    // Create gesture recognizer
    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: modelPath,
        delegate: "GPU"
      },
      runningMode: "VIDEO"
    });
    
    console.log("[Offscreen] MediaPipe initialized successfully!");
    
    videoElement = document.getElementById('webcam');
    canvasElement = document.getElementById('canvas');
    
    return { success: true };
  } catch (error) {
    console.error("[Offscreen] Failed to initialize MediaPipe:", error);
    console.error("[Offscreen] Error stack:", error.stack);
    return { success: false, error: error.message };
  }
}

// Start camera and gesture recognition
async function startCamera() {
  try {
    console.log("[Offscreen] Starting camera...");
    
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 }
      } 
    });
    
    videoElement.srcObject = stream;
    await videoElement.play();
    
    canvasElement.width = 640;
    canvasElement.height = 480;
    
    isRunning = true;
    predictLoop();
    
    console.log("[Offscreen] Camera started!");
    return { success: true };
  } catch (error) {
    console.error("[Offscreen] Failed to start camera:", error);
    return { success: false, error: error.message };
  }
}

// Stop camera
function stopCamera() {
  console.log("[Offscreen] Stopping camera...");
  
  isRunning = false;
  
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  
  if (videoElement) {
    videoElement.srcObject = null;
  }
  
  return { success: true };
}

// Main prediction loop
let lastVideoTime = -1;

function predictLoop() {
  if (!isRunning || !gestureRecognizer) return;
  
  const nowInMs = Date.now();
  
  if (videoElement.currentTime !== lastVideoTime) {
    lastVideoTime = videoElement.currentTime;
    
    try {
      const results = gestureRecognizer.recognizeForVideo(videoElement, nowInMs);
      
      // Process gestures
      if (results.gestures && results.gestures.length > 0) {
        const gesture = results.gestures[0][0];
        const gestureName = gesture.categoryName;
        const confidence = gesture.score;
        
        if (confidence > 0.7) {
          const now = Date.now();
          if (now - lastGestureTime > GESTURE_COOLDOWN) {
            lastGestureTime = now;
            
            // Send gesture to background/content script
            chrome.runtime.sendMessage({
              type: 'GESTURE_DETECTED',
              gesture: gestureName,
              confidence: confidence
            }).catch(err => console.error("[Offscreen] Error sending gesture:", err));
          }
        }
      }
      
      // Draw landmarks (optional, for debugging)
      const ctx = canvasElement.getContext('2d');
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      
      if (results.landmarks && results.landmarks.length > 0) {
        ctx.fillStyle = '#00FF00';
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        
        for (const landmarks of results.landmarks) {
          // Draw hand landmarks
          for (const landmark of landmarks) {
            const x = landmark.x * canvasElement.width;
            const y = landmark.y * canvasElement.height;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    } catch (error) {
      console.error("[Offscreen] Error in prediction:", error);
    }
  }
  
  if (isRunning) {
    requestAnimationFrame(predictLoop);
  }
}

// Listen for messages from background/content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[Offscreen] Received message:", message.type);
  
  switch (message.type) {
    case 'INIT_MEDIAPIPE':
      initializeMediaPipe().then(sendResponse);
      return true; // Keep channel open for async response
      
    case 'START_CAMERA':
      startCamera().then(sendResponse);
      return true;
      
    case 'STOP_CAMERA':
      sendResponse(stopCamera());
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

// Wait for document to be fully loaded before signaling ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log("[Offscreen] Offscreen document loaded and ready");
  });
} else {
  console.log("[Offscreen] Offscreen document loaded and ready");
}

