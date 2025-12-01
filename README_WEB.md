# F1 Race Replay - Web Version 🏎️ 🏁

A modern web application for visualizing Formula 1 race telemetry with a Python FastAPI backend and React TypeScript frontend.

## Architecture

This project uses a hybrid architecture:
- **Backend**: Python FastAPI server that processes F1 telemetry data using FastF1
- **Frontend**: React + TypeScript application with Canvas-based visualization

## Features

- 🎮 **Interactive Race Replay**: Watch races unfold with real-time driver positions
- 📊 **Live Leaderboard**: Track driver positions, tyre compounds, and status
- ⚡ **Playback Controls**: Play, pause, rewind, fast-forward with adjustable speed
- 📈 **Driver Telemetry**: View speed, gear, and DRS status for selected drivers
- 🎨 **Team Colors**: Drivers displayed in their team colors
- 🗺️ **Circuit Visualization**: Accurate track layouts with rotation correction

## Project Structure

```
f1-race-replay/
├── backend/              # Python FastAPI server
│   ├── main.py          # API endpoints
│   └── requirements.txt # Python dependencies
├── frontend/            # React TypeScript app
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── types.ts     # TypeScript interfaces
│   │   ├── App.tsx      # Main app component
│   │   └── main.tsx     # Entry point
│   ├── package.json
│   └── vite.config.ts
└── src/                 # Shared Python data processing
    ├── f1_data.py       # Telemetry processing
    └── lib/
        └── tyres.py     # Type definitions
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to the project root:**
   ```bash
   cd f1-race-replay
   ```

2. **Install Python backend dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```
   
   Or if using the virtual environment:
   ```bash
   .venv/bin/pip install -r backend/requirements.txt
   ```

3. **Start the backend server:**
   ```bash
   cd backend
   python main.py
   ```
   
   Or with the virtual environment:
   ```bash
   .venv/bin/python backend/main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## Usage

1. **Start both servers:**
   - Backend: `python backend/main.py` (port 8000)
   - Frontend: `cd frontend && npm run dev` (port 5173)

2. **Open your browser** to `http://localhost:5173`

3. **Select a race:**
   - Choose a season year (2018-2025)
   - Select a race round (1-24)
   - Pick session type (Race or Sprint)
   - Click "Load Race"

4. **Control playback:**
   - **Play/Pause**: Click button or press `SPACE`
   - **Rewind/Forward**: Click buttons or use `←` / `→` keys
   - **Speed**: Click speed button or press `↑` / `↓` or `1-4` keys
   - **Seek**: Drag the timeline slider
   - **Select Driver**: Click on driver in leaderboard for telemetry

## API Endpoints

### `GET /api/race/{year}/{round}`
Fetch race data for a specific season and round.

**Query Parameters:**
- `session_type` (optional): `R` for Race (default), `S` for Sprint
- `refresh` (optional): Force refresh cached data

**Response:**
```json
{
  "event": {...},
  "track": {...},
  "frames": [...],
  "drivers": {...},
  "driver_colors": {...},
  "circuit_rotation": 0.0
}
```

### `GET /api/seasons`
Get list of available F1 seasons (2018-2025).

## Building for Production

### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Development

### Backend Development
- API runs with auto-reload: `uvicorn main:app --reload`
- API docs available at: `http://localhost:8000/docs`

### Frontend Development
- Hot module replacement enabled
- TypeScript strict mode active
- ESLint configured

## Customization

- **Track styling**: Edit `TrackCanvas.tsx` and `.track-canvas` CSS
- **UI theme**: Modify color variables in CSS files
- **Telemetry data**: Adjust processing in `src/f1_data.py`
- **API behavior**: Configure endpoints in `backend/main.py`

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **FastF1**: F1 telemetry data library
- **Pandas**: Data processing
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Canvas API**: Track and driver rendering

## Known Issues

- Leaderboard accuracy may vary in first few corners (telemetry limitation)
- Pit stops temporarily affect position calculations
- End-of-race positions may show artifacts due to telemetry data

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Disclaimer

No copyright infringement intended. Formula 1 and related trademarks are property of their respective owners. All data is from publicly available APIs for educational purposes only.

---

Built with ❤️ by [Tom Shaw](https://tomshaw.dev)

Original Python version available in `main.py` for desktop use.
