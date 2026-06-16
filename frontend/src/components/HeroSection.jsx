import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import TruckLoading from './TruckLoading.jsx';
import './HeroSection.css';

export default function HeroSection() {
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();
  const navTimeout = useRef(null);

  const handlePlanTrip = () => {
    setNavigating(true);
    navTimeout.current = setTimeout(() => navigate('/plan'), 3000);
  };
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const actionsRef = useRef(null);
  const statsRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.7 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to(actionsRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
        .to(statsRef.current, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');

      if (videoRef.current) {
        videoRef.current.playbackRate = 0.6;
      }
    });

    return () => {
      ctx.revert();
      if (navTimeout.current) clearTimeout(navTimeout.current);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-video-bg">
        <div className="hero-video-overlay" />
        <video ref={videoRef} autoPlay muted loop playsInline>
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-road">
        <div className="hero-road-surface" />
        <div className="hero-road-lines" />
      </div>

      <div className="hero-glow" />

      <div className="hero-truck-container">
        <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.1">
          <rect x="50" y="100" width="320" height="120" rx="12" fill="var(--orange)" opacity="0.3"/>
          <rect x="60" y="110" width="90" height="70" rx="6" fill="var(--brown)" opacity="0.04"/>
          <rect x="60" y="190" width="90" height="20" rx="4" fill="var(--orange-light)" opacity="0.15"/>
          <rect x="370" y="80" width="300" height="140" rx="16" fill="var(--orange-light)" opacity="0.06"/>
          <rect x="380" y="90" width="130" height="60" rx="6" fill="var(--brown)" opacity="0.03"/>
          <rect x="520" y="90" width="130" height="60" rx="6" fill="var(--brown)" opacity="0.03"/>
          <rect x="380" y="160" width="270" height="50" rx="6" fill="var(--brown)" opacity="0.02"/>
          <rect x="660" y="120" width="40" height="50" rx="4" fill="var(--orange)" opacity="0.2"/>
          <rect x="660" y="175" width="40" height="35" rx="4" fill="var(--red)" opacity="0.15"/>
            <circle cx="120" cy="228" r="30" fill="var(--brown-light)" fillOpacity="0.1" stroke="var(--brown)" strokeWidth="2" strokeOpacity="0.08"/>
            <circle cx="120" cy="228" r="14" fill="var(--brown)" fillOpacity="0.08"/>
            <circle cx="580" cy="228" r="30" fill="var(--brown-light)" fillOpacity="0.1" stroke="var(--brown)" strokeWidth="2" strokeOpacity="0.08"/>
            <circle cx="580" cy="228" r="14" fill="var(--brown)" fillOpacity="0.08"/>
            <circle cx="650" cy="228" r="30" fill="var(--brown-light)" fillOpacity="0.1" stroke="var(--brown)" strokeWidth="2" strokeOpacity="0.08"/>
            <circle cx="650" cy="228" r="14" fill="var(--brown)" fillOpacity="0.08"/>
        </svg>
      </div>

      <div className="hero-content">
        <div className="hero-badge" ref={badgeRef}>
          <span className="dot" />
          <span className="badge-pulse">100% FMCSA Compliant</span> · Trusted by <strong>2,000+</strong> Owner-Operators
        </div>

        <h1 className="hero-title" ref={titleRef}>
          Haul <span className="em">More.</span><br />
          <span className="highlight">Violate <span className="em">Less.</span></span>
        </h1>

        <p className="hero-sub" ref={subRef}>
          <strong className="strong">Plan HOS-compliant routes in seconds.</strong> Auto-generate <em>inspection-ready</em> FMCSA log sheets,
          nail <strong>every</strong> 30-min break, and <em>never</em> blow a 14-hour window again.
          <br /><span className="highlight-box">Built by <strong>truckers</strong> who know the road — and the regulations.</span>
        </p>

        <div className="hero-actions" ref={actionsRef}>
          <button className="btn-primary" onClick={handlePlanTrip}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
              <path d="M8 6h6"/>
            </svg>
            <strong>Plan</strong> <span className="em">a Trip</span>
          </button>
          <a href="#features" className="btn-secondary"><span className="em">Explore</span> <strong>Features</strong></a>
        </div>

        <div className="hero-stats" ref={statsRef}>
          <div className="hero-stat">
            <div><span className="num">70</span><span className="num-sfx">hr</span></div>
            <div className="lbl">8-Day Cycle Limit</div>
          </div>
          <div className="hero-stat">
            <div><span className="num">11</span><span className="num-sfx">hr</span></div>
            <div className="lbl">Daily Driving Max</div>
          </div>
          <div className="hero-stat">
            <div><span className="num">30</span><span className="num-sfx">min</span></div>
            <div className="lbl">Mandatory Break</div>
          </div>
          <div className="hero-stat">
            <div><span className="num">1K</span><span className="num-sfx">mi</span></div>
            <div className="lbl">Fuel Interval</div>
          </div>
        </div>
      </div>
      {navigating && <TruckLoading overlay text="Hooking up the trailer..." />}
    </section>
  );
}
