import { useState, useEffect, useRef } from 'react';
import TripPlanner from '../components/TripPlanner.jsx';
import TripResults from '../components/TripResults.jsx';
import TruckLoading from '../components/TruckLoading.jsx';
import { planTrip } from '../api.js';
import gsap from 'gsap';
import './PlanTrip.css';

export default function PlanTrip() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const splitRef = useRef(null);
  const gifRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(titleRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2 }
      )
      .fromTo(subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6'
      );

      if (formRef.current) {
        tl.fromTo(formRef.current,
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1 },
          '-=0.4'
        );
      }

      if (gifRef.current) {
        tl.fromTo(gifRef.current,
          { x: 80, opacity: 0, rotate: 3 },
          { x: 0, opacity: 1, rotate: 0, duration: 1.2, ease: 'power2.out' },
          '-=0.8'
        );
      }

      const orbs = heroRef.current?.querySelectorAll('.orb');
      if (orbs) {
        orbs.forEach((orb, i) => {
          gsap.to(orb, {
            y: i % 2 === 0 ? -30 : 30,
            x: i % 2 === 0 ? 20 : -20,
            duration: 4 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handlePlan = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await planTrip(formData);
      setResult(data);
      setShowForm(false);
    } catch (err) {
      let msg = 'Failed to plan trip.';
      try {
        const parsed = JSON.parse(err.message);
        msg = parsed.detail || parsed.error || JSON.stringify(parsed);
      } catch {
        msg = err.message || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTrip = () => {
    setResult(null);
    setShowForm(true);
    setError(null);
  };

  return (
    <div className="plan-page">
      <div className="plan-hero" ref={heroRef}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="container">
          <h1 ref={titleRef}>
            <span className="plan-title-prefix">Plan Your</span><br />
            <span className="gradient-text gradient-animate">Next&nbsp;Haul</span>
          </h1>
          <p ref={subtitleRef} className="plan-subtitle">
            <strong>Enter your trip details.</strong> We'll handle the compliance math.
          </p>
        </div>
      </div>

      <div className="plan-content">
        <div className="container">
          {loading && <TruckLoading />}

          {!loading && showForm && (
            <div className="plan-form-area">
              <div className="plan-split" ref={splitRef}>
                <div className="plan-split-form" ref={formRef}>
                  <TripPlanner onPlanTrip={handlePlan} loading={loading} error={error} inline />
                </div>
                <div className="plan-split-gif" ref={gifRef}>
                  <div className="gif-frame">
                    <img src="/eld-demo.gif" alt="ELD log demo" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && result && !showForm && (
            <div className="plan-results-area">
              <button className="plan-new-btn" onClick={handleNewTrip}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M12 3l9 9-9 9"/></svg>
                <strong>Plan</strong> <span className="em">Another Trip</span>
              </button>
              <TripResults result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
