import { useState, useEffect } from 'react';
import RaceViewer from './components/RaceViewer';
import LoadingScreen from './components/LoadingScreen';
import RaceSelector from './components/RaceSelector';
import { RaceData } from './types';
import './App.css';

function App() {
  const [raceData, setRaceData] = useState<RaceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<{year: number, round: number} | null>(null);

  const loadRace = async (year: number, round: number, sessionType: string = 'R') => {
    setLoading(true);
    setError(null);
    console.log(`Loading race: ${year} Round ${round} Session ${sessionType}`);
    
    try {
      const response = await fetch(`/api/race/${year}/${round}?session_type=${sessionType}`);
      
      console.log(`API Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load race data: ${response.statusText}`);
      }
      
      const data: RaceData = await response.json();
      console.log('Race data loaded successfully', {
        frames: data.frames.length,
        drivers: Object.keys(data.drivers).length
      });
      
      setRaceData(data);
      setSelectedRace({ year, round });
    } catch (err) {
      console.error('Error loading race:', err);
      if (err instanceof Error) {
        setError(`Failed to load race data: ${err.message}`);
      } else {
        setError('Unknown error occurred while loading race data');
      }
      setRaceData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="error-screen">
        <h1>Error Loading Race</h1>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  if (!raceData) {
    return <RaceSelector onSelectRace={loadRace} />;
  }

  return (
    <div className="app">
      <RaceViewer raceData={raceData} onBackToSelection={() => setRaceData(null)} />
    </div>
  );
}

export default App;
