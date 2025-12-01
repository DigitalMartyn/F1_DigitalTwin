import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <h2>Loading Race Data...</h2>
      <p>This may take a moment while we fetch telemetry data</p>
    </div>
  );
}

export default LoadingScreen;
