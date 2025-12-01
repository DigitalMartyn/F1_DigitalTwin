import { useEffect, useRef, useState } from 'react';
import { RaceData, Frame } from '../types';
import Track3D from './Track3D';
import Leaderboard from './Leaderboard';
import Controls from './Controls';
import './RaceViewer.css';

interface RaceViewerProps {
  raceData: RaceData;
  onBackToSelection: () => void;
}

function RaceViewer({ raceData, onBackToSelection }: RaceViewerProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const totalFrames = raceData.frames.length;
  const frame: Frame = raceData.frames[currentFrame];

  // Debug logging
  console.log('Race data loaded:', {
    totalFrames,
    trackPoints: raceData.track.x.length,
    driversCount: Object.keys(raceData.drivers).length,
    currentFramePositions: frame?.positions ? Object.keys(frame.positions).length : 0,
    frame: frame
  });

  // Safety check - if no frame data, return early
  if (!frame || !frame.positions) {
    return <div style={{ color: 'white', padding: '2rem' }}>Loading frame data...</div>;
  }

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;

      // Update frame based on playback speed (assuming ~30fps original data)
      if (deltaTime >= (1000 / 30) / playbackSpeed) {
        setCurrentFrame((prev) => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
        lastTimeRef.current = timestamp;
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, totalFrames]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    setCurrentFrame((prev) => Math.max(0, prev - 30));
  };

  const handleFastForward = () => {
    setCurrentFrame((prev) => Math.min(totalFrames - 1, prev + 30));
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 1, 2, 4];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const handleSeek = (frameIndex: number) => {
    setCurrentFrame(frameIndex);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          handleRewind();
          break;
        case 'ArrowRight':
          handleFastForward();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          handleSpeedChange();
          break;
        case '1':
          setPlaybackSpeed(0.5);
          break;
        case '2':
          setPlaybackSpeed(1);
          break;
        case '3':
          setPlaybackSpeed(2);
          break;
        case '4':
          setPlaybackSpeed(4);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="race-viewer">
      <div className="race-content">
        <div className="track-container">
          <div className="race-info-overlay">
            <div className="lap-display">
              <div className="lap-label">Lap:</div>
              <div className="lap-value">{frame.lap}</div>
            </div>
            <div className="time-display">
              <div className="time-label">Race Time:</div>
              <div className="time-value">{formatTime(frame.time)}</div>
            </div>
          </div>

          {selectedDriver && frame.positions[selectedDriver] && (
            <div className="driver-info-panel">
              <div className="driver-panel-header">
                Driver: <span style={{ color: '#00ffcc' }}>{selectedDriver}</span>
              </div>
              <div className="driver-panel-stats">
                <div className="stat-row">
                  <span className="stat-label">Speed:</span>
                  <span className="stat-value">{frame.positions[selectedDriver].speed?.toFixed(1) || 'N/A'} km/h</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Gear:</span>
                  <span className="stat-value">{frame.positions[selectedDriver].gear || 'N/A'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">DRS:</span>
                  <span className="stat-value">{frame.positions[selectedDriver].drs ? 'On' : 'Off'}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Current Lap:</span>
                  <span className="stat-value">{frame.lap}</span>
                </div>
              </div>
            </div>
          )}

          <div className="controls-legend">
            <div className="legend-title">Controls:</div>
            <div className="legend-item">[SPACE] Pause/Resume</div>
            <div className="legend-item">[←/→] Rewind / FastForward</div>
            <div className="legend-item">[↑/↓] Speed +/- (0.5x, 1x, 2x, 4x)</div>
          </div>

          <Track3D
            trackData={raceData.track}
            frame={frame}
            driverColors={raceData.driver_colors}
            circuitRotation={raceData.circuit_rotation}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
          />
        </div>

        <div className="sidebar">
          <Leaderboard
            frame={frame}
            drivers={raceData.drivers}
            driverColors={raceData.driver_colors}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
          />
        </div>
      </div>

      <Controls
        isPlaying={isPlaying}
        playbackSpeed={playbackSpeed}
        currentFrame={currentFrame}
        totalFrames={totalFrames}
        currentLap={frame.lap}
        totalLaps={raceData.total_laps}
        raceTime={frame.time}
        onPlayPause={handlePlayPause}
        onRewind={handleRewind}
        onFastForward={handleFastForward}
        onSpeedChange={handleSpeedChange}
        onSeek={handleSeek}
      />
    </div>
  );
}

export default RaceViewer;
