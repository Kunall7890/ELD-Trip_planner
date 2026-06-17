import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './HowItWorks.css';

const steps = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    title: <>Enter <span className="em">Your Trip</span></>,
    desc: <>Tell us your current location, pickup, dropoff, and hours logged. <strong>Takes 30 seconds.</strong></>,
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    title: <>Engine Plans <span className="em">Your Day</span></>,
    desc: <>Our compliance engine calculates <strong>every</strong> drive window, <em>mandatory</em> break, fuel stop, and reset — <strong>down to the minute.</strong></>,
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>,
    title: <>Inspect <span className="em">Your Route</span></>,
    desc: <>View your <strong>entire trip</strong> on an interactive map with <em>every</em> stop, rest break, and fuel point <strong>clearly marked</strong>.</>,
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: <><span className="em">Download</span> & Go</>,
    desc: <>Get <strong>FMCSA-compliant</strong> daily log sheets for <em>every day</em> of your trip. Print, share, or save — <strong>you are inspection-ready.</strong></>,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(stepsRef.current, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="how-section" ref={sectionRef}>
      <div className="container">
        <div className="how-header">
          <span className="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="badge-pulse">How It Works</span>
          </span>
          <h2 className="section-title">
            From Input to <span className="gradient-text"><span className="em">Inspection Ready</span></span>
          </h2>
          <p className="section-sub">
            <strong>Three clicks.</strong> <em>Thirty seconds.</em> <span className="strong-orange">Fully legal route + daily log sheets.</span>
          </p>
        </div>

        <div className="how-steps">
          {steps.map((s, i) => (
            <div className="how-step" key={i} ref={el => stepsRef.current[i] = el}>
              <div className="how-step-icon">{s.icon}</div>
              <span className="how-step-num-label">Step 0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
