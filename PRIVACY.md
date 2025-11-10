# Privacy Policy for AirSwipe

**Last Updated:** November 10, 2025

## Overview

AirSwipe is committed to protecting your privacy. This privacy policy explains how our Chrome extension handles user data.

## Data Collection

AirSwipe accesses and processes the following data:

### Camera Access
- **What:** AirSwipe requires access to your device's camera to detect hand gestures
- **Why:** To recognize hand gestures for controlling webpage scrolling
- **How:** All camera feed processing happens **locally on your device** using MediaPipe AI
- **Storage:** The camera feed is **never stored, recorded, or transmitted** anywhere. It is processed in real-time and immediately discarded

### Settings Storage
- **What:** Your preferences (scroll speed, scroll distance, camera visibility, indicator visibility)
- **Why:** To remember your settings between browsing sessions
- **How:** Stored locally using Chrome's Storage API
- **Storage:** Settings remain on your device only and are never transmitted to external servers

## Data Usage

- **Local Processing Only:** All hand gesture recognition happens entirely on your device using Google's MediaPipe library
- **No External Transmission:** No data (camera feed, settings, or usage information) is ever sent to external servers
- **No Analytics:** We do not collect analytics, telemetry, or usage statistics
- **No Third Parties:** No third-party services have access to any data processed by AirSwipe

## Data Retention

- **Camera Feed:** Not stored - processed in real-time and immediately discarded
- **Settings:** Stored locally until you uninstall the extension or clear your browser data

## User Rights

You have complete control over your data:

- **Camera Access:** You can revoke camera permissions at any time through Chrome's settings (`chrome://extensions/` → AirSwipe → Permissions)
- **Settings Data:** You can reset all settings by uninstalling and reinstalling the extension
- **Clear Data:** Uninstalling the extension removes all locally stored settings

## Permissions Explained

AirSwipe requires the following Chrome permissions:

- **`activeTab`:** To scroll the current webpage when gestures are detected
- **`storage`:** To save your preference settings locally
- **`<all_urls>`:** To work on any webpage you visit
- **`offscreen`:** To run camera processing in a secure isolated context
- **Camera (requested at runtime):** To capture video for hand gesture recognition

## Children's Privacy

AirSwipe does not knowingly collect any personal information from children or any users. No data is collected or transmitted by this extension.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be posted on our GitHub repository with an updated "Last Updated" date.

## Open Source

AirSwipe is open source. You can review the complete source code at: https://github.com/beus421/AirSwipe

## Contact

If you have questions about this privacy policy, please open an issue on our GitHub repository:
https://github.com/beus421/AirSwipe/issues

## Summary

**AirSwipe is 100% privacy-focused:**
- ✅ All processing happens locally on your device
- ✅ Camera feed is never stored or transmitted
- ✅ No external servers involved
- ✅ No analytics or tracking
- ✅ Settings stored locally only
- ✅ Open source and transparent