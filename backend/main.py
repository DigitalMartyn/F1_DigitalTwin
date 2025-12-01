from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import sys
import os

# Add parent directory to path to import from src
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.f1_data import get_race_telemetry, load_race_session, enable_cache, get_circuit_rotation

app = FastAPI(title="F1 Race Replay API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and CRA default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enable FastF1 cache
enable_cache()

def get_compound_name(tyre_int):
    """Convert tyre compound integer to name"""
    compounds = {
        0: "SOFT",
        1: "MEDIUM",
        2: "HARD",
        3: "INTERMEDIATE",
        4: "WET"
    }
    return compounds.get(int(tyre_int), "UNKNOWN")

@app.get("/")
def read_root():
    return {"message": "F1 Race Replay API", "version": "1.0.0"}

@app.get("/api/race/{year}/{round_number}")
def get_race_data(
    year: int, 
    round_number: int,
    session_type: str = "R",
    refresh: bool = False
):
    """
    Get race telemetry data for a specific year and round.
    
    - **year**: F1 season year
    - **round_number**: Race round number
    - **session_type**: 'R' for Race, 'S' for Sprint
    - **refresh**: Force refresh telemetry data
    """
    try:
        # Load session
        session = load_race_session(year, round_number, session_type)
        
        # Get telemetry data
        race_telemetry = get_race_telemetry(session, session_type=session_type)
        
        # Get track data
        example_lap = session.laps.pick_fastest()
        telemetry = example_lap.get_telemetry()
        
        # Get circuit rotation
        circuit_rotation = get_circuit_rotation(session)
        
        # Convert track coordinates to list format
        track_data = {
            "x": telemetry['X'].tolist(),
            "y": telemetry['Y'].tolist(),
        }
        
        # Convert frames to serializable format
        # Frames might already be dicts if loaded from cache
        frames_data = []
        for frame in race_telemetry['frames']:
            # Check if frame is already a dict (from JSON cache) or an object
            if isinstance(frame, dict):
                # Transform cached format to expected format
                transformed_frame = {
                    "time": float(frame.get("t", 0)),
                    "lap": int(frame.get("lap", 1)),
                    "positions": {}
                }
                # Transform drivers dict to positions dict
                for driver_code, driver_data in frame.get("drivers", {}).items():
                    transformed_frame["positions"][driver_code] = {
                        "x": driver_data.get("x"),
                        "y": driver_data.get("y"),
                        "position": driver_data.get("position"),
                        "status": "OnTrack",  # Default status
                        "compound": get_compound_name(driver_data.get("tyre", 0)),
                        "speed": driver_data.get("speed"),
                        "gear": driver_data.get("gear"),
                        "drs": driver_data.get("drs"),
                    }
                frames_data.append(transformed_frame)
            else:
                frame_dict = {
                    "time": float(frame.time),
                    "lap": int(frame.lap),
                    "positions": {}
                }
                for driver, pos_data in frame.positions.items():
                    frame_dict["positions"][driver] = {
                        "x": float(pos_data.x) if pos_data.x is not None else None,
                        "y": float(pos_data.y) if pos_data.y is not None else None,
                        "position": int(pos_data.position) if pos_data.position is not None else None,
                        "status": pos_data.status,
                        "compound": pos_data.compound,
                        "speed": float(pos_data.speed) if pos_data.speed is not None else None,
                        "gear": int(pos_data.gear) if pos_data.gear is not None else None,
                        "drs": int(pos_data.drs) if pos_data.drs is not None else None,
                    }
                frames_data.append(frame_dict)
        
        # Get driver info
        drivers_info = {}
        for driver in session.drivers:
            driver_info = session.get_driver(driver)
            drivers_info[driver] = {
                "abbreviation": driver_info['Abbreviation'],
                "full_name": driver_info['FullName'],
                "team": driver_info['TeamName'],
                "number": str(driver_info['DriverNumber'])
            }
        
        return {
            "event": {
                "name": session.event['EventName'],
                "round": int(session.event['RoundNumber']),
                "year": year,
                "session_type": session_type
            },
            "track": track_data,
            "frames": frames_data,
            "track_statuses": race_telemetry['track_statuses'],
            "driver_colors": race_telemetry['driver_colors'],
            "drivers": drivers_info,
            "circuit_rotation": float(circuit_rotation) if circuit_rotation else 0.0,
            "total_laps": int(session.total_laps) if hasattr(session, 'total_laps') else None
        }
        
    except Exception as e:
        import traceback
        error_detail = f"Error loading race data: {str(e)}\n{traceback.format_exc()}"
        print(error_detail)  # Log to console
        raise HTTPException(status_code=500, detail=f"Error loading race data: {str(e)}")

@app.get("/api/seasons")
def get_available_seasons():
    """Get list of available F1 seasons."""
    # FastF1 supports data from 2018 onwards
    return {
        "seasons": list(range(2018, 2026))  # Update end year as needed
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
