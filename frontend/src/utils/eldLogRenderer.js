const STATUS_ROWS = {
  off_duty: 0,
  sleeper: 1,
  driving: 2,
  on_duty: 3,
};

const ROW_COLORS = {
  off_duty: '#16a34a',
  sleeper: '#9333ea',
  driving: '#FF7A00',
  on_duty: '#dc2626',
};

const STATUS_LABELS = [
  'OFF DUTY',
  'SLEEPER BERTH',
  'DRIVING',
  'ON DUTY (NOT DRIVING)',
];

const STATUS_KEYS = ['off_duty', 'sleeper', 'driving', 'on_duty'];

function formatHMS(hoursDecimal) {
  if (hoursDecimal === undefined || hoursDecimal === null) return '0h 0m';
  const totalMin = Math.round(hoursDecimal * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m}m`;
}

export function renderEldLog(canvas, eldDay, dayIndex, options = {}) {
  try {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const width = options.width || 1200;
    const height = options.height || 620;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.maxWidth = '100%';
    ctx.scale(dpr, dpr);

    const margin = { top: 72, right: 36, bottom: 130, left: 130 };
    const plotW = width - margin.left - margin.right;
    const plotH = height - margin.top - margin.bottom;
    const rowH = plotH / 4;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#2D2A24';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText("DRIVER'S DAILY LOG", width / 2, 12);

    const infoY = 34;
    ctx.fillStyle = '#6B6560';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Date: ' + (eldDay.date || ''), margin.left, infoY);
    ctx.fillText('Driver: ____________________', margin.left + 200, infoY);
    ctx.fillText('Carrier: ____________________', margin.left + 440, infoY);

    ctx.fillStyle = '#2D2A24';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (let h = 0; h <= 24; h++) {
      const x = margin.left + (h / 24) * plotW;
      ctx.fillText(String(h), x, margin.top - 3);
    }

    ctx.strokeStyle = '#EDE6DB';
    ctx.lineWidth = 0.5;
    for (let h = 0; h <= 24; h++) {
      const x = margin.left + (h / 24) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, margin.top + plotH);
      ctx.stroke();
    }

    ctx.strokeStyle = '#D4CCC0';
    ctx.lineWidth = 1;
    for (let r = 0; r <= 4; r++) {
      const y = margin.top + r * rowH;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(margin.left + plotW, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#2D2A24';
    ctx.lineWidth = 2;
    ctx.strokeRect(margin.left, margin.top, plotW, plotH);

    ctx.fillStyle = '#6B6560';
    ctx.font = '9px sans-serif';
    ctx.textBaseline = 'middle';
    for (let r = 0; r < 4; r++) {
      ctx.textAlign = 'right';
      ctx.fillStyle = ROW_COLORS[STATUS_KEYS[r]];
      ctx.fillText(STATUS_LABELS[r], margin.left - 10, margin.top + r * rowH + rowH / 2);
    }

    const segments = eldDay.segments || [];
    if (segments.length === 0) {
      ctx.fillStyle = '#9C9690';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No log data available', width / 2, margin.top + plotH / 2);
      return;
    }

    const sorted = [...segments].sort((a, b) => a.start_hour - b.start_hour);

    let prevEndX = null;
    let prevY = null;

    for (const seg of sorted) {
      const status = seg.status;
      const row = STATUS_ROWS[status] !== undefined ? STATUS_ROWS[status] : 0;

      const x1 = margin.left + (seg.start_hour / 24) * plotW;
      const x2 = margin.left + (seg.end_hour / 24) * plotW;
      const y = margin.top + row * rowH + rowH / 2;

      ctx.fillStyle = ROW_COLORS[status] || '#6B6560';
      ctx.globalAlpha = 0.06;
      ctx.fillRect(x1, margin.top + row * rowH, x2 - x1, rowH);
      ctx.globalAlpha = 1.0;

      ctx.beginPath();
      ctx.arc(x1, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2D2A24';
      ctx.fill();

      if (prevEndX !== null && prevY !== null) {
        ctx.beginPath();
        ctx.moveTo(prevEndX, prevY);
        ctx.lineTo(x1, prevY);
        ctx.strokeStyle = '#2D2A24';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1, prevY);
        ctx.lineTo(x1, y);
        ctx.strokeStyle = '#2D2A24';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = '#2D2A24';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x2, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2D2A24';
      ctx.fill();

      if (seg.label) {
        ctx.fillStyle = '#2D2A24';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const midX = (x1 + x2) / 2;
        ctx.fillText(seg.label, midX, y - 6);
      }

      prevEndX = x2;
      prevY = y;
    }

    const headerBottom = margin.top + plotH + 14;

    ctx.fillStyle = '#6B6560';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('MIDNIGHT', margin.left, headerBottom);
    ctx.fillText('NOON', margin.left + plotW / 2, headerBottom);
    ctx.fillText('MIDNIGHT', margin.left + plotW, headerBottom);

    for (let h = 0; h <= 24; h++) {
      const x = margin.left + (h / 24) * plotW;
      ctx.fillText(String(h), x, headerBottom);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#9C9690';
    ctx.font = 'bold 9px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('HOURS', margin.left + plotW / 2, headerBottom + 16);

    const summaryY = headerBottom + 40;

    ctx.fillStyle = '#2D2A24';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    const col1X = margin.left;
    const col2X = margin.left + 180;
    const col3X = margin.left + 360;

    ctx.fillText('TIME SUMMARY', col1X, summaryY);

    ctx.font = '8px sans-serif';
    ctx.fillStyle = '#6B6560';

    let yOff = summaryY + 16;
    ctx.fillStyle = ROW_COLORS.off_duty;
    ctx.fillText('OFF DUTY:  ________________', col1X, yOff);
    ctx.fillStyle = ROW_COLORS.sleeper;
    ctx.fillText('SLEEPER:  ________________', col2X, yOff);
    yOff += 14;
    ctx.fillStyle = ROW_COLORS.driving;
    ctx.fillText('DRIVING:  ________________', col1X, yOff);
    ctx.fillStyle = ROW_COLORS.on_duty;
    ctx.fillText('ON DUTY:  ________________', col2X, yOff);

    const totalMiles = eldDay.total_driving_hours ? Math.round(eldDay.total_driving_hours * 65) : 0;
    const drivingHrs = eldDay.total_driving_hours || 0;
    const onDutyHrs = eldDay.total_on_duty_hours || 0;
    const totalOnDuty = drivingHrs + onDutyHrs;

    ctx.fillStyle = '#2D2A24';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('Total On-Duty: ' + formatHMS(totalOnDuty), col1X, yOff + 16);

    ctx.fillStyle = '#2D2A24';
    ctx.font = '8px sans-serif';
    ctx.fillText('Total Miles: ' + totalMiles, col2X, yOff + 16);

    const remHrs = eldDay.remaining_cycle_hours;
    if (remHrs !== undefined) {
      ctx.fillStyle = remHrs < 5 ? '#dc2626' : '#16a34a';
      ctx.fillText('Cycle Remaining: ' + remHrs + ' hrs', col3X, yOff + 16);
    }

    const remarksY = yOff + 38;
    ctx.strokeStyle = '#D4CCC0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, remarksY);
    ctx.lineTo(margin.left + plotW, remarksY);
    ctx.stroke();

    ctx.fillStyle = '#6B6560';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('REMARKS:', margin.left, remarksY + 4);

    let remarkLine = remarksY + 18;
    let remarkIdx = 0;
    for (const seg of sorted) {
      if (!seg.label) continue;
      const hour = Math.floor(seg.start_hour);
      const min = Math.round((seg.start_hour - hour) * 60);
      const timeStr = String(hour).padStart(2, '0') + ':' + String(min).padStart(2, '0');
      ctx.fillText(timeStr + ' - ' + seg.label, margin.left + (remarkIdx % 2) * (plotW / 2), remarkLine + Math.floor(remarkIdx / 2) * 14);
      remarkIdx++;
    }
  } catch (e) {
    console.error('ELD render error:', e);
  }
}
