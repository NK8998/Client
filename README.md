# 📺 YouTube Clone – Full-Featured Video Platform

A polished YouTube clone featuring a **fully functional video player**, dynamic chapters, a **miniplayer**, and intuitive UI interactions. Built with user experience at its core, this project brings together advanced playback features you'd expect from a real video platform.

---

## 🚀 Features

- 🎥 **Video Playback**
  - Fully working player with support for seeking, buffering, and smooth playback.
  - Thumbnail previews when hovering the progress bar.
  - Miniplayer mode for watching videos while browsing.

- ⏱️ **Chapters from Descriptions**
  - Timestamps written in the video description are automatically parsed into chapters.
  - Chapters are displayed in a dedicated viewing panel.
  - Clicking a chapter jumps to that segment of the video.

- 🪟 **Miniplayer Mode**
  - Shrinks the video into a corner while navigating other sections of the site.
  - Persistent playback and controls.

### 🛠️ In Progress: Custom Router for Seamless Navigation

Currently, the **miniplayer** implementation relies on workaround logic to persist playback across page transitions. To address this, a **custom client-side router** is being developed to:

* Maintain component state (like the video player) across route changes.
* Prevent full unmounting of the player during navigation.
* Enable true "app-like" navigation behavior without losing playback or state.

This will drastically clean up the architecture and allow for more **native-feeling navigation**—essential for a smooth and scalable video platform.

> *No more duct tape. Just clean, declarative routing.*


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
