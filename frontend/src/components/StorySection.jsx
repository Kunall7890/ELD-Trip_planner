import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Truck3D from './Truck3D.jsx';
import './StorySection.css';

export default function StorySection() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: i * 0.25,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="story-section" ref={sectionRef} id="story">
      <div className="container">
        <div className="story-grid">
          <div className="story-visual">
            <div className="story-visual-inner">
              <div className="log-preview">
                <Truck3D />
                <div className="log-preview-label">Daily ELD Log · Live Preview</div>
              </div>
            </div>
          </div>

          <div>
            <span className="section-label">Why It Matters</span>
            <h2 className="section-title">
              Compliance Isn't Optional.<br />
              <span className="gradient-text">Neither Are You.</span>
            </h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>
              The FMCSA ELD mandate changed everything. One violation can cost thousands
              and put you out of service. Most drivers are one missed break away from a fine —
              but you do not have to be.
            </p>

            <div className="story-timeline">
              {[
                { title: '2017 — The ELD Mandate', desc: 'Electronic logging becomes mandatory. Paper logs are officially retired. The industry changes overnight.' },
                { title: 'The Compliance Trap', desc: 'HOS violations cost drivers thousands in fines and lost time. 30-min break rules and 70hr cycle limits catch even veteran drivers off-guard.' },
                { title: '2024 — Smart Compliance', desc: 'Real-time HOS calculations predict and prevent violations before they happen. Trip planning and compliance finally work together.' },
              ].map((step, i) => (
                <div className="story-step" key={i} ref={el => stepsRef.current[i] = el}>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
