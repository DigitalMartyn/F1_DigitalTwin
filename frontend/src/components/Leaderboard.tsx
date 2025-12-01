import { Frame, DriverInfo } from '../types';
import './Leaderboard.css';

interface LeaderboardProps {
  frame: Frame;
  drivers: Record<string, DriverInfo>;
  driverColors: Record<string, string>;
  selectedDriver: string | null;
  onSelectDriver: (driver: string | null) => void;
}

function Leaderboard({ frame, drivers, driverColors, selectedDriver, onSelectDriver }: LeaderboardProps) {
  // Sort drivers by position
  const sortedDrivers = Object.entries(frame.positions)
    .filter(([_, pos]) => pos.position !== null)
    .sort(([_, a], [__, b]) => (a.position || 999) - (b.position || 999));

  const getTyreColor = (compound: string) => {
    const tyreColors: Record<string, string> = {
      'SOFT': '#ff0000',
      'MEDIUM': '#ffff00',
      'HARD': '#ffffff',
      'INTERMEDIATE': '#00ff00',
      'WET': '#0000ff',
    };
    return tyreColors[compound.toUpperCase()] || '#888';
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <div className="lap-info">
          Lap {frame.lap}
        </div>
      </div>
      
      <div className="leaderboard-list">
        {sortedDrivers.map(([driverCode, pos]) => {
          const driverInfo = drivers[driverCode];
          const isSelected = driverCode === selectedDriver;
          const isOut = pos.status !== 'OnTrack';
          
          return (
            <div
              key={driverCode}
              className={`leaderboard-item ${isSelected ? 'selected' : ''} ${isOut ? 'out' : ''}`}
              onClick={() => onSelectDriver(isSelected ? null : driverCode)}
            >
              <div className="position">{pos.position}</div>
              <div
                className="driver-color"
                style={{ backgroundColor: driverColors[driverCode] }}
              />
              <div className="driver-info">
                <div className="driver-name">{driverCode}</div>
                <div className="driver-team">{driverInfo?.team || 'Unknown'}</div>
              </div>
              <div className="tyre-compound">
                <div
                  className="tyre-indicator"
                  style={{ backgroundColor: getTyreColor(pos.compound) }}
                />
              </div>
              {isOut && <div className="status-badge">OUT</div>}
            </div>
          );
        })}
      </div>
      
      {selectedDriver && frame.positions[selectedDriver] && (
        <div className="driver-telemetry">
          <h3>Telemetry - {selectedDriver}</h3>
          <div className="telemetry-grid">
            <div className="telemetry-item">
              <span className="label">Speed</span>
              <span className="value">{frame.positions[selectedDriver].speed?.toFixed(0) || 'N/A'} km/h</span>
            </div>
            <div className="telemetry-item">
              <span className="label">Gear</span>
              <span className="value">{frame.positions[selectedDriver].gear || 'N/A'}</span>
            </div>
            <div className="telemetry-item">
              <span className="label">DRS</span>
              <span className="value">{frame.positions[selectedDriver].drs ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
