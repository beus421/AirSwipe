# 🖐️ AirSwipe - Control Your Browser with Hand Gestures ✨

<p align="center">
  <img src="icon.png" alt="AirSwipe Logo" width="128" height="128">
</p>

<p align="center">
  <a href="https://chrome.google.com/webstore">
    <img src="https://img.shields.io/badge/Chrome-Web%20Store-blue?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Chrome Web Store">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License">
  </a>
  <a href="https://github.com/beus421/AirSwipe/stargazers">
    <img src="https://img.shields.io/github/stars/beus421/AirSwipe?style=for-the-badge" alt="Stars">
  </a>
</p>

## 🚀 Overview

**AirSwipe** is a Chrome extension that lets you control any webpage with hand gestures using AI-powered hand tracking. No keyboard, no mouse – just your hands! Perfect for accessibility, hands-free browsing, or just showing off your futuristic browsing setup.

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

1. Visit the Chrome Web Store page (link will be added after publication)
2. Click "Add to Chrome"
3. Grant camera permissions when prompted
4. Start gesturing!

### Option 2: Manual Installation (For Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/beus421/AirSwipe.git
   cd AirSwipe
   ```

2. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `AirSwipe` directory

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

## 🔒 Privacy

AirSwipe is built with privacy as the top priority:

- ✅ All processing happens **locally on your device**
- ✅ Camera feed is **never stored, recorded, or transmitted**
- ✅ No external servers involved
- ✅ No analytics or tracking
- ✅ Settings stored locally only
- ✅ 100% open source and transparent

Read our full [Privacy Policy](PRIVACY.md) for details.

## 🛠️ Technologies Used

- [MediaPipe](https://developers.google.com/mediapipe) - Google's ML solution for hand tracking
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/) - Manifest V3
- **Vanilla JavaScript** - No frameworks, pure performance
- **Canvas API** - Real-time hand skeleton visualization
- **Chrome Storage API** - Persistent settings storage
- **Offscreen Document API** - Secure camera processing

## 🏗️ Architecture

AirSwipe uses Chrome's Manifest V3 architecture for maximum security and performance:

- **Background Service Worker** - Manages extension lifecycle
- **Offscreen Document** - Isolated environment for camera and MediaPipe processing
- **Content Script** - Handles page scrolling and user interface
- **Popup** - Settings and control interface

All MediaPipe files are bundled locally (~17MB) to ensure reliability and privacy.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MediaPipe](https://developers.google.com/mediapipe) by Google for the amazing hand tracking technology
- Chrome Extensions team for comprehensive documentation
- All contributors and users of AirSwipe

## 📧 Contact

- GitHub: [@beus421](https://github.com/beus421)
- Issues: [GitHub Issues](https://github.com/beus421/AirSwipe/issues)

---

<p align="center">Made with ❤️ by <a href="https://github.com/beus421">beus421</a></p>