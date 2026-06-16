import { useRef, useEffect } from 'react';
import { renderEldLog } from '../utils/eldLogRenderer.js';
import './EldLogSheet.css';

export default function EldLogSheet({ eldDay, dayIndex }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && eldDay) {
      renderEldLog(canvasRef.current, eldDay, dayIndex || 1);
    }
  }, [eldDay, dayIndex]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `eld-log-day${dayIndex || 1}-${eldDay?.date || 'unknown'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="eld-log-sheet">
      <canvas ref={canvasRef}></canvas>
      <div className="eld-log-actions">
        <button className="eld-log-btn" onClick={handleDownload}>
          Download PNG
        </button>
      </div>
    </div>
  );
}
