import './TruckLoading.css';

export default function TruckLoading({ text = 'Computing your HOS-compliant route...', overlay }) {
  return (
    <div className={`truck-loading${overlay ? ' overlay' : ''}`}>
      <div className="truck-scene">
        <svg className="truck-svg" viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cabGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A00"/>
              <stop offset="100%" stopColor="#CC6200"/>
            </linearGradient>
            <linearGradient id="trailGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D2A24"/>
              <stop offset="100%" stopColor="#1A1815"/>
            </linearGradient>
          </defs>
          <g className="truck-body-g">
            <rect x="30" y="45" width="200" height="80" rx="4" fill="url(#trailGrad)" stroke="#6B6560" strokeWidth="1.5"/>
            <rect x="45" y="55" width="170" height="60" rx="2" fill="none" stroke="#6B6560" strokeWidth="1" strokeDasharray="4 4"/>
            <rect x="230" y="40" width="65" height="60" rx="6" fill="url(#cabGrad)" stroke="#E65C00" strokeWidth="1.5"/>
            <rect x="260" y="48" width="28" height="28" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.1)"/>
            <rect x="237" y="48" width="16" height="28" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.08)"/>
            <rect x="295" y="70" width="8" height="16" rx="2" fill="#6B6560"/>
            <rect x="295" y="90" width="4" height="12" rx="1" fill="#9C9690"/>
            <rect x="252" y="85" width="20" height="6" rx="2" fill="#2D2A24"/>
            <rect x="235" y="88" width="14" height="3" rx="1" fill="#2D2A24"/>
            <circle className="truck-light" cx="275" cy="42" r="3" fill="#FF9900"/>
            <circle className="truck-light" cx="255" cy="42" r="2" fill="#DC2626"/>
          </g>
          <circle className="truck-wheel" cx="100" cy="125" r="22" fill="#2D2A24" stroke="#6B6560" strokeWidth="2"/>
          <circle className="truck-wheel" cx="220" cy="125" r="22" fill="#2D2A24" stroke="#6B6560" strokeWidth="2"/>
          <g className="wheel-rim-back">
            <circle cx="100" cy="125" r="14" fill="none" stroke="#9C9690" strokeWidth="3" strokeDasharray="6 6"/>
            <circle cx="100" cy="125" r="5" fill="#6B6560"/>
          </g>
          <g className="wheel-rim-front">
            <circle cx="220" cy="125" r="14" fill="none" stroke="#9C9690" strokeWidth="3" strokeDasharray="6 6"/>
            <circle cx="220" cy="125" r="5" fill="#6B6560"/>
          </g>
          <g className="exhaust-g">
            <circle className="exhaust-puff" cx="300" cy="85" r="4" fill="rgba(107,101,96,0.12)"/>
            <circle className="exhaust-puff" cx="310" cy="78" r="5" fill="rgba(107,101,96,0.08)"/>
            <circle className="exhaust-puff" cx="322" cy="68" r="6" fill="rgba(107,101,96,0.05)"/>
          </g>
          <g className="road-g">
            <rect x="0" y="148" width="400" height="32" rx="2" fill="#EDE6DB"/>
            <rect className="road-stripe" x="20" y="162" width="40" height="3" rx="1" fill="#FF7A00"/>
            <rect className="road-stripe" x="80" y="162" width="40" height="3" rx="1" fill="#FF7A00"/>
            <rect className="road-stripe" x="140" y="162" width="40" height="3" rx="1" fill="#FF7A00"/>
            <rect className="road-stripe" x="200" y="162" width="40" height="3" rx="1" fill="#FF7A00"/>
            <rect className="road-stripe" x="260" y="162" width="40" height="3" rx="1" fill="#FF7A00"/>
            <rect className="road-stripe" x="320" y="162" width="40" height="3" rx="1" fill="#FF7A00"/>
            <rect className="road-stripe" x="380" y="162" width="40" height="3" rx="1" fill="#FF7A00"/>
          </g>
        </svg>
      </div>
      <p className="truck-loading-text">{text}</p>
    </div>
  );
}
