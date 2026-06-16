const API_BASE = '/api';
const GEOCODE_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeLocation(query) {
  if (!query || query.trim().length === 0) return null;
  const url = `${GEOCODE_URL}?format=json&q=${encodeURIComponent(query)}&limit=1`;
  try {
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length === 0) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      display_name: data[0].display_name,
    };
  } catch {
    return null;
  }
}

export async function planTrip(tripData) {
  const res = await fetch(`${API_BASE}/plan-trip/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });
  if (!res.ok) {
    let detail = 'Server error. Please try again.';
    try {
      const err = await res.json();
      if (err.detail) detail = err.detail;
      else if (typeof err === 'object') detail = JSON.stringify(err);
      else detail = err.toString();
    } catch {
      detail = `Request failed (${res.status}). Please try again.`;
    }
    throw new Error(detail);
  }
  return res.json();
}
