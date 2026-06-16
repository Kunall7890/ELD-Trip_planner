import './RouteInstructions.css';

function formatHour(h) {
  if (h === undefined || h === null) return '';
  const hour24 = Math.floor(h);
  const min = Math.round((h - hour24) * 60);
  if (hour24 === 24 || hour24 === 0) return 'Midnight';
  if (hour24 === 12) return min === 0 ? '12:00 PM' : `12:${min.toString().padStart(2, '0')} PM`;
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const h12 = hour24 % 12 || 12;
  return `${h12}:${min.toString().padStart(2, '0')} ${period}`;
}

const statusLabels = {
  driving: 'DRIVING',
  on_duty: 'ON DUTY',
  off_duty: 'OFF DUTY',
  sleeper: 'SLEEPER',
};

export default function RouteInstructions({ trip, logs, stops }) {
  const lastLog = logs && logs.length > 0 ? logs[logs.length - 1] : null;

  return (
    <div>
      <div className="cycle-stats">
        <div className="cycle-stat">
          <div className="value">{trip.cycle_hours_used}</div>
          <div className="label">Cycle Used</div>
        </div>
        <div className="cycle-stat">
          <div className="value">{logs.length}</div>
          <div className="label">Days Required</div>
        </div>
        <div className="cycle-stat">
          <div className="value gold">{lastLog?.remaining_cycle_hours ?? 70}</div>
          <div className="label">Remaining Cycle</div>
        </div>
        <div className="cycle-stat">
          <div className="value">{trip.total_distance_miles}</div>
          <div className="label">Total Miles</div>
        </div>
      </div>

      <div className="route-instructions-list">
        {logs.map((day, dayIdx) => (
          <div key={dayIdx}>
            <div className="instruction-day-header">
              Day {dayIdx + 1} — {day.date} ({day.total_driving_hours} hrs driving)
            </div>
            {day.segments.map((seg, segIdx) => (
              <div className="instruction-item" key={segIdx}>
                <div className="instruction-time">
                  {formatHour(seg.start_hour)} – {formatHour(seg.end_hour)}
                </div>
                <div>
                  <span className={`instruction-status-badge ${seg.status}`}>
                    {statusLabels[seg.status] || seg.status}
                  </span>
                  <span className="instruction-label">{seg.label}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {stops && stops.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-muted)' }}>
            Stops & Breaks
          </div>
          <div className="stops-bar">
            {stops.map((stop, idx) => (
              <span className="stop-chip" key={idx}>
                {stop.type} · {stop.date} {formatHour(stop.start_hour)}-{formatHour(stop.end_hour)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
