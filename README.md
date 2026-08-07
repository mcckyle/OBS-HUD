[![Deploy to GitHub Pages](https://github.com/mcckyle/OBS-HUD/actions/workflows/deploy.yml/badge.svg)](https://github.com/mcckyle/OBS-HUD/actions/workflows/deploy.yml)
![License](https://img.shields.io/badge/License-MIT-blue)

# OBS-HUD

**OBS-HUD** is a lightweight browser-source overlay for OBS Studio that brings a clean, NASA-punk inspired telemetry interface to **Starfield** livestreams. Designed to complement gameplay rather than distract from it, the overlay combines live YouTube data with a transparent, high-performance React interface.

---

## Screenshot

![Overlay Screenshot](./public/images/obs-hud-08062026.png)
*A minimal telemetry overlay designed to blend naturally with Starfield's visual language.*

---

## Features

Live Telemetry
* Session timer
* Subscriber count
* Recent transmission feed

Visual Design
* NASA-punk inspired HUD
* Transparent browser source
* Smooth Motion animations

Developer Experience
* React + Vite
* Modular components
* Easy customization

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/mcckyle/OBS-HUD.git
cd OBS-HUD
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## OBS Studio Setup

1. Build the project or run the local development server.
2. Create a **Browser Source** in OBS Studio.
3. Point the Browser Source to the built application or development URL.
4. Enable a transparent background.
5. Position the overlay wherever you'd like within your scene.

---

## YouTube Configuration

The overlay reads its YouTube credentials directly from the Browser Source URL.

Example:

```bash
http://localhost:5173/OBS-HUD/?channelId=YOUR_CHANNEL_ID&key=YOUR_API_KEY
```

This approach keeps configuration separate from the source code and avoids embedding credentials directly in the project.

---


## Project Structure

```
OBS-HUD/
├── .github/              # GitHub workflows (CI/CD).
├── public/               # Static assets (served as-is).
├── src/                  # Application Source code.
│   ├── components/       # Reusable React components.
│   │   ├── HudHeader/
│   │   │   ├── HudHeader.jsx
│   │   │   └── HudHeader.css
│   │   │
│   │   ├── SessionTimer/
│   │   │   ├── SessionTimer.jsx
│   │   │   └── SessionTimer.css
│   │   │
│   │   ├── CrewPanel/
│   │   │   ├── CrewPanel.jsx
│   │   │   └── CrewPanel.css
│   │   │
│   │   ├── TransmissionPanel/
│   │   │   ├── TransmissionPanel.jsx
│   │   │   └── TransmissionPanel.css
│   │   │
│   │   └── HudSection/
│   │       ├── HudSection.jsx
│   │       └── HudSection.css
│   │
│   ├── utils/
│   │   ├── time.js
│   │   └── motion.js
│   │
│   ├── hooks/            # Custom React hooks.
│   │   ├── useYouTubeData.jsx
│   │   ├── useInterval.js
│   │   ├── useMissionClock.js
│   │   └── useSessionTimer.js
│   │
│   ├── App.jsx           # Main React application component.
│   ├── App.css           # Styles specific to App.jsx.
│   ├── main.jsx          # React DOM entry point.
│   └── index.css         # Global styles.
│
├── .gitignore            # Specifies intentionally untracked files and folders to ignore.
├── LICENSE               # Open source license for the project.
├── README.md             # Project overview / documentation.
├── eslint.config.js      # ESLint configuration.
├── index.html            # HTML entry point.
├── vite.config.js        # Vite config for build and development.
├── package.json          # Project metadata, dependencies, and scripts.
└── package-lock.json     # Exact versions of installed dependencies.
```

---

## Customization

OBS-HUD is intentionally modular. Common customizations include:

* Colors
* Typography
* Layout
* Animation timing
* YouTube polling interval
* HUD modules

---

## Built With

* React
* Vite
* Motion
* YouTube Data API v3
* OBS Studio Browser Source

---

## License

This project is licensed under the MIT License.

---

Created with ❤️ for immersive livestreams.
