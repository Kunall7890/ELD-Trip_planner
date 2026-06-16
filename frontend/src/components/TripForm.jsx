import { useState } from 'react';
import { geocodeLocation } from '../api.js';
import './TripForm.css';

export default function TripForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    cycle_hours_used: '',
  });
  const [geocoding, setGeocoding] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeocoding(true);
    try {
      const [currentGeo, pickupGeo, dropoffGeo] = await Promise.all([
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

      if (currentGeo) {
        payload.current_lat = currentGeo.lat;
        payload.current_lng = currentGeo.lng;
      }
      if (pickupGeo) {
        payload.pickup_lat = pickupGeo.lat;
        payload.pickup_lng = pickupGeo.lng;
      }
      if (dropoffGeo) {
        payload.dropoff_lat = dropoffGeo.lat;
        payload.dropoff_lng = dropoffGeo.lng;
      }

      onSubmit(payload);
    } catch (err) {
      const simplePayload = {
        current_location: form.current_location,
        pickup_location: form.pickup_location,
        dropoff_location: form.dropoff_location,
        cycle_hours_used: parseFloat(form.cycle_hours_used) || 0,
      };
      onSubmit(simplePayload);
    } finally {
      setGeocoding(false);
    }
  };

  const btnText = loading ? 'Planning Trip...' : geocoding ? 'Geocoding locations...' : 'Plan Trip';

  return (
    <div className="card">
      <h2>Trip Details</h2>
      <form className="trip-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="current_location">Current Location</label>
          <input
            id="current_location"
            name="current_location"
            type="text"
            value={form.current_location}
            onChange={handleChange}
            placeholder="e.g. New York, NY"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pickup_location">Pickup Location</label>
          <input
            id="pickup_location"
            name="pickup_location"
            type="text"
            value={form.pickup_location}
            onChange={handleChange}
            placeholder="e.g. Philadelphia, PA"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dropoff_location">Dropoff Location</label>
          <input
            id="dropoff_location"
            name="dropoff_location"
            type="text"
            value={form.dropoff_location}
            onChange={handleChange}
            placeholder="e.g. Washington, DC"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cycle_hours_used">Current Cycle Used (Hrs)</label>
          <input
            id="cycle_hours_used"
            name="cycle_hours_used"
            type="number"
            min="0"
            max="70"
            step="0.5"
            value={form.cycle_hours_used}
            onChange={handleChange}
            placeholder="e.g. 10"
            required
          />
          <span className="hint">Hours already used in your 70hr/8day cycle (0-70)</span>
        </div>
        <button type="submit" className="submit-btn" disabled={loading || geocoding}>
          {btnText}
        </button>
      </form>
    </div>
  );
}
