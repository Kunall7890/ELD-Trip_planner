import { useState, useRef, useCallback } from 'react';
import EldLogSheet from './EldLogSheet.jsx';
import './EldLogsView.css';

export default function EldLogsView({ logs }) {
  const [activeDay, setActiveDay] = useState(0);
  const canvasRefs = useRef({});
  const downloadTimerRef = useRef(null);

  if (!logs || logs.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}><em>No log data available.</em></p>;
  }

  const handleDownloadAll = useCallback(() => {
    if (downloadTimerRef.current) {
      clearTimeout(downloadTimerRef.current);
    }
    logs.forEach((log, idx) => {
      downloadTimerRef.current = setTimeout(() => {
        const canvas = canvasRefs.current[idx];
        if (canvas) {
          const link = document.createElement('a');
          link.download = `eld-log-day${idx + 1}-${log.date}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      }, idx * 500);
    });
  }, [logs]);

  const setCanvasRef = useCallback((idx) => (el) => {
    if (el) {
      canvasRefs.current[idx] = el.querySelector('canvas');
    } else {
      delete canvasRefs.current[idx];
    }
  }, []);

  return (
    <div className="eld-logs-view">
      <div className="day-tabs">
        {logs.map((log, idx) => (
          <button
            key={idx}
            className={`day-tab ${activeDay === idx ? 'active' : ''}`}
            onClick={() => setActiveDay(idx)}
          >
            Day {idx + 1}
            <span className="day-hours">{log.date} · {log.total_driving_hours} hrs</span>
          </button>
        ))}
      </div>

      <div className="log-content">
        <h2><strong>Day {activeDay + 1}</strong> <span className="em">— {logs[activeDay].date}</span></h2>
        <div ref={setCanvasRef(activeDay)}>
          <EldLogSheet eldDay={logs[activeDay]} dayIndex={activeDay + 1} />
        </div>
        {logs.length > 1 && (
          <button className="download-all-btn" onClick={handleDownloadAll}>
            <strong>Download</strong> <span className="em">All Log Sheets</span> ({logs.length})
          </button>
        )}
      </div>
    </div>
  );
}
