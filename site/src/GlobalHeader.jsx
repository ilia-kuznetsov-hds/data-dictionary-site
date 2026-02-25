import { Link, NavLink, useLocation } from 'react-router-dom';
import anznnLogo from './assets/anznn-logo-nano-banana.png';

export default function GlobalHeader() {
  const location = useLocation();
  const isDictionaryActive =
    location.pathname === '/' || location.pathname.startsWith('/fields/');

  return (
    <header className="global-header">
      <Link to="/" className="global-brand" aria-label="Go to Data Dictionary home">
        <img src={anznnLogo} alt="" className="global-brand-logo" />
        <span className="global-brand-name">ANZNN</span>
      </Link>

      <nav className="global-tabs" aria-label="Top-level sections">
        <Link to="/" className={`global-tab ${isDictionaryActive ? 'active' : ''}`}>
          Data Dictionary
        </Link>
        <NavLink to="/reports" className={({ isActive }) => `global-tab ${isActive ? 'active' : ''}`}>
          Reports
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `global-tab ${isActive ? 'active' : ''}`}>
          About
        </NavLink>
      </nav>
    </header>
  );
}
