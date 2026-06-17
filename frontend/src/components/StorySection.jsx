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
            toggleActions: 'play none none none',
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
            <span className="section-label"><span className="badge-pulse">Why It Matters</span></span>
            <h2 className="section-title">
              Compliance <span className="em">Isn't</span> Optional.<br />
              <span className="gradient-text"><span className="em">Neither</span> Are You.</span>
            </h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>
              The FMCSA ELD mandate changed <em>everything</em>. <strong>One violation can cost thousands</strong>
              and put you <em>out of service</em>. Most drivers are <strong>one missed break away</strong> from a fine —
              but <span className="highlight-box"><strong>you do not have to be.</strong></span>
            </p>

            <div className="story-timeline">
              {[
                { title: <><strong>2017</strong> <span className="em">— The ELD Mandate</span></>, desc: <>Electronic logging becomes <strong>mandatory</strong>. Paper logs are <em>officially retired</em>. The industry changes <strong>overnight</strong>.</> },
                { title: <><span className="em-gold">The Compliance Trap</span></>, desc: <><strong>HOS violations cost drivers thousands</strong> in fines and lost time. 30-min break rules and 70hr cycle limits catch <em>even veteran drivers</em> off-guard.</> },
                { title: <><strong>2024</strong> <span className="em">— Smart Compliance</span></>, desc: <><strong>Real-time</strong> HOS calculations predict and <em>prevent</em> violations before they happen. Trip planning and compliance <strong>finally work together</strong>.</> },
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
