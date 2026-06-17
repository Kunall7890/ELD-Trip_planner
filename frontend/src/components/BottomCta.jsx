import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TruckLoading from './TruckLoading.jsx';
import './BottomCta.css';

export default function BottomCta() {
  const [visible, setVisible] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollY > 500 && maxScroll - scrollY > 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handlePlan = () => {
    setNavigating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate('/plan');
      setNavigating(false);
    }, 2000);
  };

  return (
    <>
      <div className={`bottom-cta${visible ? ' visible' : ''}`}>
        <div className="bottom-cta-inner">
          <div className="bottom-cta-text">
            <strong>Ready to hit the road?</strong>
            <span className="em"> Plan your HOS-compliant route in seconds.</span>
          </div>
          <button className="bottom-cta-btn" onClick={handlePlan}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
            </svg>
            <strong>Plan</strong> <span className="em">a Trip</span>
          </button>
        </div>
      </div>
      {navigating && <TruckLoading overlay text="Hooking up the trailer..." />}
    </>
  );
}
