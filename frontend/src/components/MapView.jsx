import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import './MapView.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function FitBounds({ legs }) {
  const map = useMap();
  useEffect(() => {
    if (legs && legs.length > 0) {
      const points = legs.flatMap(l => [
        [l.from_coords.lat, l.from_coords.lng],
        [l.to_coords.lat, l.to_coords.lng],
      ]);
      if (points.length > 0) {
        map.fitBounds(points, { padding: [50, 50] });
      }
    }
  }, [legs, map]);
  return null;
}

const legColors = { pickup: '#60a5fa', dropoff: '#34d399' };
const LEG_TYPE_LABELS = { pickup: 'Leg 1: To Pickup', dropoff: 'Leg 2: To Dropoff' };

export default function MapView({ legs }) {
  if (!legs || legs.length === 0) {
    return (
      <div style={{
        height: 380,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)',
      }}>
        Map requires coordinates — enter city, state format
      </div>
    );
  }

  const defaultCenter = [legs[0].from_coords.lat, legs[0].from_coords.lng];

  return (
    <div>
      <div className="map-container">
        <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds legs={legs} />
          {legs.map((leg, idx) => (
            <div key={idx}>
              <Marker position={[leg.from_coords.lat, leg.from_coords.lng]}>
                <Popup>
                  <strong>{idx === 0 ? 'Start' : 'Pickup'}</strong><br />{leg.from}
                </Popup>
              </Marker>
              <Marker position={[leg.to_coords.lat, leg.to_coords.lng]}>
                <Popup>
                  <strong>{leg.type === 'pickup' ? 'Pickup' : 'Dropoff'}</strong><br />{leg.to}
                </Popup>
              </Marker>
              <Polyline
                positions={[[leg.from_coords.lat, leg.from_coords.lng], [leg.to_coords.lat, leg.to_coords.lng]]}
                color={legColors[leg.type] || '#94a3b8'}
                weight={3}
                opacity={0.7}
              />
            </div>
          ))}
        </MapContainer>
      </div>
      <div className="map-route-info">
        {legs.map((leg, idx) => (
          <div className="map-route-leg" key={idx}>
            <div className={`leg-type ${leg.type}`}>
              {LEG_TYPE_LABELS[leg.type] || `Leg ${idx + 1}: ${leg.type}`}
            </div>
            <div className="leg-desc">{leg.from} → {leg.to}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
