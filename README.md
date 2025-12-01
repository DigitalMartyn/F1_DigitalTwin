# F1 Digital Twin 🏎️ 🏁

A web-based Formula 1 race replay application with interactive 3D visualization. Watch historical F1 races unfold with real-time telemetry data, orbital camera controls, and a live leaderboard.

![Race Replay Preview](./resources/preview.png)

## Features

- **3D Track Visualization:** Interactive Three.js 3D rendering of F1 circuits with orbital camera controls
- **Live Telemetry:** Real-time driver positions, speeds, gear, and DRS status
- **Interactive Leaderboard:** Click drivers to highlight and follow them on track
- **Race Selector:** Choose any race from 2018+ seasons (Race or Sprint sessions)
- **Playback Controls:** Pause, rewind, fast forward, and adjust playback speed (0.5x to 4x)
- **Tyre Compound Visualization:** Color-coded tyre indicators for each driver
- **Driver Status Tracking:** Visual indicators for drivers who retire or encounter issues
- **Cached Data Support:** Automatically caches race data for faster subsequent loads

## Tech Stack

**Backend:**
- Python 3.8+ with FastAPI
- FastF1 for F1 telemetry data
- Pandas & NumPy for data processing

**Frontend:**
- React 18 with TypeScript
- Three.js with React Three Fiber
- Vite for fast development and builds

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16+ and npm

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/DigitalMartyn/F1_DigitalTwin.git
cd F1_DigitalTwin
```

2. **Set up Python virtual environment:**
```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. **Install Python dependencies:**
```bash
pip install -r backend/requirements.txt
```

4. **Install frontend dependencies:**
```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

### Running the Application

**Option 1: Use the start script (recommended)**
```bash
chmod +x start.sh
./start.sh
```

**Option 2: Start services manually**

Terminal 1 - Backend:
```bash
.venv/bin/python backend/main.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Then open your browser to **http://localhost:5173**

## Controls

**Playback:**
- **SPACE** - Play/Pause
- **← →** - Rewind/Fast Forward (30 frames)
- **1-4** - Set playback speed directly (0.5x, 1x, 2x, 4x)

**3D View:**
- **Left Click + Drag** - Rotate camera
- **Right Click + Drag** - Pan view
- **Scroll Wheel** - Zoom in/out

**Leaderboard:**
- Click any driver to highlight and track them on the 3D visualization

## Project Structure

```
F1_DigitalTwin/
├── backend/
│   ├── main.py              # FastAPI server & race data endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Track3D.tsx         # 3D track visualization
│   │   │   ├── RaceViewer.tsx      # Main race viewer
│   │   │   ├── Leaderboard.tsx     # Driver standings
│   │   │   ├── Controls.tsx        # Playback controls
│   │   │   └── RaceSelector.tsx    # Race selection UI
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── vite.config.ts
├── src/
│   ├── f1_data.py           # Telemetry processing
│   └── lib/tyres.py         # Type definitions
├── computed_data/           # Cached race telemetry (auto-generated)
├── start.sh                 # Quick start script
└── README.md
```

## API Endpoints

- `GET /api/race/{year}/{round}?session_type=R` - Get race data for a specific event
  - Parameters:
    - `year` - Season year (2018+)
    - `round` - Race round number (1-24)
    - `session_type` - R (Race) or S (Sprint)
    - `refresh` - Force refresh cached data (optional)

## Data Caching

Race telemetry is cached in `computed_data/` after first load. This significantly speeds up subsequent loads of the same race. Use the refresh parameter in the API or delete cached files to force a refresh.

## Known Issues

- Leaderboard positioning may be inaccurate during the first few corners as telemetry data stabilizes
- Pit stop entries can temporarily affect position calculations
- End-of-race positions may show anomalies due to telemetry coordinates after race finish
- These are inherent limitations of the telemetry data and are being actively improved

## Development

**Building for Production:**
```bash
cd frontend
npm run build
```

**Running Tests:**
Backend and frontend tests coming soon.

## Contributing

Contributions are welcome! Please feel free to submit pull requests for:
- UI/UX improvements
- New features and visualizations
- Bug fixes and performance optimizations
- Documentation improvements

## 📝 License

This project is licensed under the MIT License.

## ⚠️ Disclaimer

No copyright infringement intended. Formula 1 and related trademarks are the property of their respective owners. All data is sourced from publicly available APIs via the FastF1 library and is used for educational and non-commercial purposes only.

## Acknowledgments

- Original concept and Python implementation by [Tom Shaw](https://tomshaw.dev)
- Web conversion and 3D visualization by Martyn Gooding
- Built with [FastF1](https://github.com/theOehrly/Fast-F1) for telemetry data
- Powered by [FastAPI](https://fastapi.tiangolo.com/), [React](https://react.dev/), and [Three.js](https://threejs.org/)

---

🏎️ Built with ❤️ for F1 fans
