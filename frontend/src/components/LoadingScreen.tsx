import './LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <h2>Loading Race Data...</h2>
      <p>Fetching telemetry from FastF1 API</p>
      <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
        This may take 30-60 seconds for the first load
      </p>
    </div>
  );
}

export default LoadingScreen;
