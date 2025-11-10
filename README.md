# 🖐️ HandScroll - Control Your Browser with Hand Gestures ✨

![Project Demo](https://github.com/beus421/handscroll/blob/main/demo.gif)

<p align="center">
  <a href="https://chrome.google.com/webstore">
    <img src="https://img.shields.io/badge/Chrome-Web%20Store-blue?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Chrome Web Store">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License">
  </a>
  <a href="https://github.com/beus421/handscroll/stargazers">
    <img src="https://img.shields.io/github/stars/beus421/handscroll?style=for-the-badge" alt="Stars">
  </a>
</p>

## 🚀 Overview

**HandScroll** is a Chrome extension that lets you control any webpage with hand gestures using AI-powered hand tracking. No keyboard, no mouse – just your hands! Perfect for accessibility, hands-free browsing, or just showing off your futuristic browsing setup.

### ✨ Key Features

- 🖐️ **Real-time hand gesture recognition** powered by MediaPipe AI
- 📜 **Smooth scroll control** with customizable speed and distance
- 📹 **Toggle camera view** visibility while keeping gestures active
- 💡 **Simple torch-style interface** for quick on/off control
- ⚙️ **Persistent settings** that save across sessions
- 🔒 **100% Privacy** - All processing happens locally, no data sent anywhere
- 🎯 **Universal** - Works on any webpage

## 🎯 Supported Gestures

| Gesture | Action | Description |
|---------|--------|-------------|
| 👍 **Thumb Up** | Scroll to Top | Jump to the top of the page instantly |
| 👎 **Thumb Down** | Scroll to Bottom | Jump to the bottom of the page |
| ☝️ **Pointing Up** | Scroll Up | Scroll up by your configured distance |
| ✊ **Closed Fist** | Scroll Down | Scroll down by your configured distance |
| ✌️ **Victory** | Detected | (Coming soon - custom actions!) |
| 🤟 **ILoveYou** | Detected | (Coming soon - custom actions!) |

## 📦 Installation

### Option 1: Chrome Web Store (Coming Soon! 🎉)

1. Visit the [Chrome Web Store page](#) (link coming soon)
2. Click "Add to Chrome"
3. Grant camera permissions when prompted
4. Start gesturing!

### Option 2: Manual Installation (For Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/beus421/handscroll.git
   cd handscroll
   ```

2. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `handscroll` directory

3. **Grant Permissions:**
   - Click the extension icon in your browser toolbar
   - Allow camera access when prompted

4. **You're ready!** 🎉

## 🎮 Usage

1. **Activate** - Click the extension icon and press the torch button 🔦
2. **Position** - Place your hand in front of your webcam
3. **Gesture** - Make any supported gesture to control scrolling
4. **Customize** - Adjust speed, distance, and visibility settings
5. **Enjoy** - Browse hands-free!

### ⚙️ Settings

- **Speed Multiplier** (0.5x - 2.0x) - Control how fast you scroll
- **Distance** (25% - 100%) - Set scroll distance as viewport percentage
- **Camera Toggle** - Hide/show camera view (gestures work either way!)
- **Indicator Toggle** - Show/hide gesture notification popups

## 🛠️ Technologies Used

- [MediaPipe](https://developers.google.com/mediapipe) - Google's ML solution for hand tracking
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/) - Manifest V3
- **Vanilla JavaScript** - No frameworks, pure performance
- **Canvas API** - Real-time hand skeleton visualization
- **Chrome Storage API** - Persistent settings storage

