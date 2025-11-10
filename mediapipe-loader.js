// mediapipe-loader.js - Runs in page context with full gesture logic
(async function() {
    try {
      console.log("Loading MediaPipe from page context...");
      
      const { GestureRecognizer, FilesetResolver } = await import(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3'
      );
      
      console.log("MediaPipe imported successfully!");
      
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      
      const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO"
      });
      
      console.log("✅ MediaPipe GestureRecognizer fully loaded!");
      
      // Store recognizer and state
      const state = {
        gestureRecognizer,
        isRunning: false,
        lastVideoTime: -1,
        lastGestureTime: 0,
        GESTURE_COOLDOWN: 1000,
        videoElement: null,
        canvasElement: null,
        showCamera: true
      };
      
      // Listen for start command from content script
      window.addEventListener('start-gesture-recognition', (e) => {
        const { videoId, canvasId } = e.detail;
        
        state.videoElement = document.getElementById(videoId);
        state.canvasElement = document.getElementById(canvasId);
        
        if (!state.videoElement || !state.canvasElement) {
          console.error("Could not find video or canvas elements");
          return;
        }
        
        state.isRunning = true;
        console.log("Starting gesture recognition loop...");
        predict();
      });
      
      // Listen for stop command
      window.addEventListener('stop-gesture-recognition', () => {
        state.isRunning = false;
        console.log("Stopping gesture recognition...");
      });
      
      // Listen for settings updates
      window.addEventListener('update-camera-visibility', (e) => {
        state.showCamera = e.detail.showCamera;
      });
      
      function predict() {
        if (!state.isRunning) return;
        
        const nowInMs = Date.now();
        
        if (state.videoElement.currentTime !== state.lastVideoTime) {
          state.lastVideoTime = state.videoElement.currentTime;
          
          try {
            const results = state.gestureRecognizer.recognizeForVideo(state.videoElement, nowInMs);
            
            // Draw hand landmarks only if camera is visible
            const ctx = state.canvasElement.getContext('2d');
            ctx.clearRect(0, 0, state.canvasElement.width, state.canvasElement.height);
            
            if (state.showCamera && results.landmarks && results.landmarks.length > 0) {
              ctx.fillStyle = '#00FF00';
              ctx.strokeStyle = '#00FF00';
              ctx.lineWidth = 2;
              
              for (const landmarks of results.landmarks) {
                // Draw connections
                const connections = [
                  [0,1],[1,2],[2,3],[3,4],
                  [0,5],[5,6],[6,7],[7,8],
                  [0,9],[9,10],[10,11],[11,12],
                  [0,13],[13,14],[14,15],[15,16],
                  [0,17],[17,18],[18,19],[19,20],
                  [5,9],[9,13],[13,17]
                ];
                
                for (const [start, end] of connections) {
                  const startPoint = landmarks[start];
                  const endPoint = landmarks[end];
                  const x1 = startPoint.x * state.canvasElement.width;
                  const y1 = startPoint.y * state.canvasElement.height;
                  const x2 = endPoint.x * state.canvasElement.width;
                  const y2 = endPoint.y * state.canvasElement.height;
                  
                  ctx.beginPath();
                  ctx.moveTo(x1, y1);
                  ctx.lineTo(x2, y2);
                  ctx.stroke();
                }
                
                // Draw points
                for (const landmark of landmarks) {
                  const x = landmark.x * state.canvasElement.width;
                  const y = landmark.y * state.canvasElement.height;
                  ctx.beginPath();
                  ctx.arc(x, y, 4, 0, 2 * Math.PI);
                  ctx.fill();
                }
              }
            }
            
            // Process gestures
            if (results.gestures && results.gestures.length > 0) {
              const gesture = results.gestures[0][0];
              const gestureName = gesture.categoryName;
              const confidence = gesture.score;
              
              if (confidence > 0.7) {
                const now = Date.now();
                if (now - state.lastGestureTime > state.GESTURE_COOLDOWN) {
                  state.lastGestureTime = now;
                  
                  // Send gesture to content script
                  window.dispatchEvent(new CustomEvent('gesture-detected', {
                    detail: { gesture: gestureName, confidence }
                  }));
                }
              }
            }
          } catch (error) {
            console.error("Error in gesture recognition:", error);
          }
        }
        
        if (state.isRunning) {
          requestAnimationFrame(predict);
        }
      }
      
      // Dispatch ready event
      window.dispatchEvent(new CustomEvent('mediapipe-ready'));
      
    } catch (error) {
      console.error("Failed to load MediaPipe:", error);
      window.dispatchEvent(new CustomEvent('mediapipe-error', { detail: error.message }));
    }
  })();