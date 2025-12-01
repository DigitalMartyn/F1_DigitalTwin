import { useState } from 'react';
import './RaceSelector.css';

interface RaceSelectorProps {
  onSelectRace: (year: number, round: number, sessionType: string) => void;
}

function RaceSelector({ onSelectRace }: RaceSelectorProps) {
  const [year, setYear] = useState(2024);
  const [round, setRound] = useState(1);
  const [sessionType, setSessionType] = useState('R');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectRace(year, round, sessionType);
  };

  return (
    <div className="race-selector">
      <div className="race-selector-content">
        <h1>🏎️ F1 Race Replay</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="year">Season Year</label>
            <input
              id="year"
              type="number"
              min="2018"
              max="2025"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="round">Race Round</label>
            <input
              id="round"
              type="number"
              min="1"
              max="24"
              value={round}
              onChange={(e) => setRound(parseInt(e.target.value))}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="sessionType">Session Type</label>
            <select
              id="sessionType"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
            >
              <option value="R">Race</option>
              <option value="S">Sprint</option>
            </select>
          </div>
          
          <button type="submit" className="load-button">
            Load Race
          </button>
        </form>
      </div>
    </div>
  );
}

export default RaceSelector;
