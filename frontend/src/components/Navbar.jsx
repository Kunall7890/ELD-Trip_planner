import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <div className="logo-icon">
            <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="15" y="38" width="48" height="32" rx="4" fill="var(--brown)" opacity="0.9"/>
              <rect x="18" y="43" width="42" height="22" rx="2" fill="var(--cream)" opacity="0.15"/>
              <path d="M63 34h20a4 4 0 014 4v22a4 4 0 01-4 4H63V34z" fill="var(--orange)"/>
              <rect x="68" y="39" width="10" height="10" rx="2" fill="var(--cream)" opacity="0.2"/>
              <rect x="82" y="44" width="4" height="18" rx="1" fill="var(--orange)" opacity="0.7"/>
              <circle cx="27" cy="74" r="8" fill="var(--brown)" stroke="var(--brown-light)" strokeWidth="2"/>
              <circle cx="27" cy="74" r="4" fill="var(--brown-light)"/>
              <circle cx="68" cy="74" r="8" fill="var(--brown)" stroke="var(--brown-light)" strokeWidth="2"/>
              <circle cx="68" cy="74" r="4" fill="var(--brown-light)"/>
              <path d="M10 47l5-4h25v8H10z" fill="var(--orange)" opacity="0.3"/>
            </svg>
          </div>
          <span className="logo-text">ELD<span className="logo-accent">Haul</span></span>
        </Link>

        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
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
  );
}
