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
              <div className="position-number">{pos.position}.</div>
              <div className="driver-code" style={{ color: driverColors[driverCode] }}>
                {driverCode}
              </div>
              <div className="tyre-indicator-small">
                <div
                  className="tyre-dot"
                  style={{ backgroundColor: getTyreColor(pos.compound) }}
                />
              </div>
              {isOut && <div className="status-out">OUT</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Leaderboard;
