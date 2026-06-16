import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-logo gradient-text">ELD Trip Planner</div>
        <p>
          FMCSA HOS Compliant · Built with Django + React · OpenStreetMap &copy; contributors
        </p>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/plan">Plan Trip</Link>
        </div>
        <p style={{ marginTop: 16, fontSize: '0.75rem', opacity: 0.5 }}>
          &copy; {new Date().getFullYear()} · Not affiliated with FMCSA or DOT
        </p>
      </div>
    </footer>
  );
}
