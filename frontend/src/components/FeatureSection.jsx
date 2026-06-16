import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './FeatureSection.css';

const features = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    iconClass: 'f-icon-1',
    title: 'One-Click Route & ELD Sync',
    desc: 'Enter your stops once. Our engine builds a fully legal route — automatically scheduling driving windows, 30-min breaks, and 10-hour resets. No guesswork. No violations.',
    tag: '49 CFR Part 395',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    iconClass: 'f-icon-2',
    title: 'Inspection-Ready Log Sheets',
    desc: 'Daily FMCSA Form 395 logs generated instantly. Every status — Off Duty, Sleeper, Driving, On Duty — is graphed and ready for download. Show up to every weigh station prepared.',
    tag: 'Inspection Ready',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    iconClass: 'f-icon-3',
    title: 'Zero-Violation HOS Engine',
    desc: 'Hard-enforced 11-hour drive limit, 14-hour on-duty window, mandatory 30-min break before the 8th hour, and 70hr/8day cycle tracking. Our math never misses.',
    tag: 'Real-Time Compliance',
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 17h16M12 3v12m-8-4l8-8 8 8"/><rect x="4" y="17" width="16" height="4" rx="1"/></svg>,
    iconClass: 'f-icon-4',
    title: 'Fuel & Load Optimization',
    desc: 'Auto-inserts fueling stops every 1,000 miles. Schedules pickup and drop-off windows. Everything a long-haul driver needs to keep the wheels turning and the revenue flowing.',
    tag: 'DOT Recommended',
  },
];

export default function FeatureSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(cardsRef.current, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="features-section" ref={sectionRef} id="features">
      <div className="container">
        <div className="features-header">
          <span className="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            Built for the Cab
          </span>
          <h2 className="section-title">
            Your <span className="gradient-text">Co-Pilot</span> for the Long Haul
          </h2>
          <p className="section-sub">
            From pretrip to dropoff — every feature engineered to keep you compliant,
            maximize your drive time, and eliminate paperwork headaches.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} ref={el => cardsRef.current[i] = el}>
              <div className={`feature-icon-box ${f.iconClass}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-tag">{f.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
