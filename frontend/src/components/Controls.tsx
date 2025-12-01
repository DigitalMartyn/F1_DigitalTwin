import './Controls.css';

interface ControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  currentFrame: number;
  totalFrames: number;
  currentLap: number;
  totalLaps: number | null;
  raceTime: number;
  onPlayPause: () => void;
  onRewind: () => void;
  onFastForward: () => void;
  onSpeedChange: () => void;
  onSeek: (frame: number) => void;
}

function Controls({
  isPlaying,
  playbackSpeed,
  currentFrame,
  totalFrames,
  currentLap,
  totalLaps,
  raceTime,
  onPlayPause,
  onRewind,
  onFastForward,
  onSpeedChange,
  onSeek,
}: ControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseInt(e.target.value));
  };

  return (
    <div className="controls">
      <div className="timeline">
        <input
          type="range"
          min="0"
          max={totalFrames - 1}
          value={currentFrame}
          onChange={handleSliderChange}
          className="timeline-slider"
        />
        <div className="timeline-info">
          <span>Lap {currentLap}{totalLaps ? ` / ${totalLaps}` : ''}</span>
          <span>{formatTime(raceTime)}</span>
        </div>
      </div>
      
      <div className="control-buttons">
        <button onClick={onRewind} className="control-btn" title="Rewind (←)">
          ⏪
        </button>
        
        <button onClick={onPlayPause} className="control-btn play-btn" title="Play/Pause (Space)">
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button onClick={onFastForward} className="control-btn" title="Fast Forward (→)">
          ⏩
        </button>
        
        <button onClick={onSpeedChange} className="control-btn speed-btn" title="Playback Speed (↑↓)">
          {playbackSpeed}x
        </button>
      </div>
      
      <div className="keyboard-hints">
        <span>SPACE: Play/Pause</span>
        <span>← →: Rewind/Forward</span>
        <span>1-4: Speed</span>
      </div>
    </div>
  );
}

export default Controls;
