import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { geocodeLocation } from '../api.js';
import './TripPlanner.css';

export default function TripPlanner({ onPlanTrip, loading, error, standalone, compact, inline }) {
  const [form, setForm] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    cycle_hours_used: '',
  });
  const [geocoding, setGeocoding] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (standalone || inline) return;
    gsap.to(cardRef.current, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: cardRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
    });
  }, [standalone, inline]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeocoding(true);
    try {
      const [cg, pg, dg] = await Promise.all([
        geocodeLocation(form.current_location),
        geocodeLocation(form.pickup_location),
        geocodeLocation(form.dropoff_location),
      ]);
      const payload = {
        current_location: form.current_location,
        pickup_location: form.pickup_location,
        dropoff_location: form.dropoff_location,
        cycle_hours_used: parseFloat(form.cycle_hours_used) || 0,
      };
      if (cg) { payload.current_lat = cg.lat; payload.current_lng = cg.lng; }
      if (pg) { payload.pickup_lat = pg.lat; payload.pickup_lng = pg.lng; }
      if (dg) { payload.dropoff_lat = dg.lat; payload.dropoff_lng = dg.lng; }
      onPlanTrip(payload);
    } catch {
      onPlanTrip({
        current_location: form.current_location,
        pickup_location: form.pickup_location,
        dropoff_location: form.dropoff_location,
        cycle_hours_used: parseFloat(form.cycle_hours_used) || 0,
      });
    } finally {
      setGeocoding(false);
    }
  };

  const isBusy = loading || geocoding;
  const btnText = loading ? 'Computing Route...' : geocoding ? 'Locating...' : 'Plan This Haul';

  return (
    <section className={`planner-section${standalone ? ' standalone' : ''}${compact ? ' compact' : ''}${inline ? ' inline' : ''}`} id="planner">
      <div className={standalone || inline ? '' : 'container'}>
        {!standalone && !inline && (
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="section-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>
              Trip Planner
            </span>
            <h2 className="section-title">
              Plan Your <span className="gradient-text">Next Route</span>
            </h2>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Enter your stops. We'll handle the HOS compliance.
            </p>
          </div>
        )}

        <div className="planner-form-card" ref={cardRef}>
          <form className="planner-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="current_location">📍 Current Location</label>
              <input id="current_location" name="current_location" type="text"
                value={form.current_location} onChange={handleChange}
                placeholder="e.g. New York, NY" required />
            </div>
            <div className="form-field">
              <label htmlFor="pickup_location">📦 Pickup Location</label>
              <input id="pickup_location" name="pickup_location" type="text"
                value={form.pickup_location} onChange={handleChange}
                placeholder="e.g. Philadelphia, PA" required />
            </div>
            <div className="form-field">
              <label htmlFor="dropoff_location">🏁 Dropoff Location</label>
              <input id="dropoff_location" name="dropoff_location" type="text"
                value={form.dropoff_location} onChange={handleChange}
                placeholder="e.g. Washington, DC" required />
            </div>
            <div className="form-field">
              <label htmlFor="cycle_hours_used">⏱️ Cycle Hours Used</label>
              <input id="cycle_hours_used" name="cycle_hours_used" type="number"
                min="0" max="70" step="0.5"
                value={form.cycle_hours_used} onChange={handleChange}
                placeholder="e.g. 10" required />
              <span className="form-hint">Hours logged in your current 70hr/8day cycle</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="form-submit" disabled={isBusy}>
              {isBusy && <span className="spinner" />}
              {isBusy ? btnText : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/></svg>Plan This Haul</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
