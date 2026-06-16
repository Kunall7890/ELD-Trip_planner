import RouteInstructions from './RouteInstructions.jsx';
import MapView from './MapView.jsx';
import EldLogsView from './EldLogsView.jsx';
import './TripResults.css';

export default function TripResults({ result }) {
  if (!result) return null;

  const { trip, legs, eld_logs, stops } = result;

  return (
    <div className="results-section">
      <div className="results-grid">
        <div className="result-card">
          <h2>
            <span className="icon" style={{ background: 'rgba(30,64,175,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>
            </span>
            <span className="em">Trip</span> <strong>Summary</strong>
          </h2>
          <div className="trip-summary-grid">
            <div className="trip-summary-item">
              <div className="val" style={{ fontSize: '0.85rem' }}>{trip.current_location}</div>
              <div className="lbl">Current</div>
            </div>
            <div className="trip-summary-item">
              <div className="val" style={{ fontSize: '0.85rem' }}>{trip.pickup_location}</div>
              <div className="lbl">Pickup</div>
            </div>
            <div className="trip-summary-item">
              <div className="val" style={{ fontSize: '0.85rem' }}>{trip.dropoff_location}</div>
              <div className="lbl">Dropoff</div>
            </div>
            <div className="trip-summary-item">
              <div className="val">{trip.total_distance_miles}</div>
              <div className="lbl">Miles</div>
            </div>
            <div className="trip-summary-item">
              <div className="val">{trip.cycle_hours_used}</div>
              <div className="lbl">Cycle Used</div>
            </div>
            <div className="trip-summary-item">
              <div className="val">{eld_logs.length}</div>
              <div className="lbl">Days</div>
            </div>
          </div>
        </div>

        <div className="result-card">
          <h2>
            <span className="icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
            <strong>Route</strong> <span className="em">Instructions</span>
          </h2>
          <RouteInstructions trip={trip} logs={eld_logs} stops={stops} />
        </div>

        {legs && legs.length > 0 && (
          <div className="result-card">
            <h2>
              <span className="icon" style={{ background: 'rgba(22,163,74,0.1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              </span>
              <span className="em">Route</span> <strong>Map</strong>
            </h2>
            <div className="map-wrapper-result">
              <MapView legs={legs} />
            </div>
          </div>
        )}

        <div className="result-card">
          <h2>
            <span className="icon" style={{ background: 'rgba(168,85,247,0.1)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </span>
            <strong>Daily</strong> <span className="em">ELD Logs</span>
          </h2>
          <EldLogsView logs={eld_logs} />
        </div>
      </div>
    </div>
  );
}
