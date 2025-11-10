# AirSwipe Setup Guide

## What Changed

We've completely rewritten the extension to fix the Content Security Policy (CSP) error and use the proper Manifest V3 architecture.

### Architecture Changes

**Before:**
- ❌ Tried to load MediaPipe from CDN (blocked by CSP)
- ❌ Injected scripts into page context
- ❌ Violated CSP rules

**After:**
- ✅ MediaPipe files bundled locally in `lib/mediapipe/`
- ✅ Uses Offscreen Document API (proper Manifest V3 approach)
- ✅ Camera/MediaPipe runs in isolated offscreen document
- ✅ Background service worker manages communication
- ✅ Content script just handles page scrolling

### New Files

1. **background.js** - Service worker that manages the offscreen document
2. **offscreen.html** - Hidden document where MediaPipe runs
3. **offscreen.js** - MediaPipe gesture recognition code
4. **lib/mediapipe/** - Local MediaPipe library files
   - tasks-vision.js (860KB)
   - wasm/vision_wasm_internal.wasm (8.5MB)
   - wasm/vision_wasm_internal.js (200KB)
   - models/gesture_recognizer.task (8.2MB)

### Modified Files

1. **manifest.json** - Added offscreen permission, background service worker
2. **content.js** - Simplified to just handle gestures and scrolling
3. **Deleted mediapipe-loader.js** - No longer needed

## How to Test

1. **Reload the extension:**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the AirSwipe extension
   - Or disable and re-enable it

2. **Test on any webpage:**
   - Click the AirSwipe extension icon
   - Click "Enable Gestures"
   - Allow camera access when prompted
   - You should see "✅ Gesture Control Active!" indicator

3. **Try gestures:**
   - ☝️ **Pointing Up** - Scroll up
   - ✊ **Closed Fist** - Scroll down  
   - 👍 **Thumbs Up** - Scroll to top
   - 👎 **Thumbs Down** - Scroll to bottom

## Troubleshooting

If it doesn't work:

1. **Check console errors:**
   - Open DevTools Console (F12)
   - Look for messages prefixed with `[Background]`, `[Offscreen]`, or `[Content]`

2. **Check service worker:**
   - Go to `chrome://extensions/`
   - Click "Service Worker" link under AirSwipe
   - Check console for errors

3. **Check permissions:**
   - Make sure camera permission is granted
   - Check that offscreen permission is granted

4. **File size check:**
   ```bash
   ls -lh lib/mediapipe/models/
   ls -lh lib/mediapipe/wasm/
   ```
   Make sure files are properly downloaded (not empty or tiny)

## Benefits of New Architecture

- ✅ **No CSP violations** - Everything loads from extension
- ✅ **Better security** - Offscreen document isolated from page
- ✅ **Proper Manifest V3** - Uses recommended APIs
- ✅ **Better performance** - MediaPipe runs in separate context
- ✅ **More reliable** - No dependency on external CDNs

## Technical Notes

- **Offscreen Document**: Special HTML document that runs in background, can access camera
- **Service Worker**: Manages lifecycle of offscreen document and message routing
- **Content Script**: Simplified, just handles UI and page interactions
- **Total Size**: ~17MB (mostly MediaPipe WASM/models)

