import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TruckLoading from './TruckLoading.jsx';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handlePlanTrip = () => {
    setNavigating(true);
    setTimeout(() => {
      navigate('/plan');
      setNavigating(false);
    }, 2000);
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <div className="logo-icon">
              <img src="/truck-logo.png" alt="Truck Logo" className="logo-img" />
            </div>
            <span className="logo-text">ELD<span className="logo-accent">Haul</span></span>
          </Link>

          <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
            <Link to="/" onClick={closeMenu}><strong>Home</strong></Link>
            <a href="#features" onClick={closeMenu}><span className="em">Features</span></a>
            <Link to="/plan" className="navbar-cta" onClick={(e) => { e.preventDefault(); closeMenu(); handlePlanTrip(); }}>Plan a Trip</Link>
            <button className="navbar-mobile-btn" onClick={toggleMenu} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {navigating && <TruckLoading overlay text="Hooking up the trailer..." />}
    </>
  );
}
