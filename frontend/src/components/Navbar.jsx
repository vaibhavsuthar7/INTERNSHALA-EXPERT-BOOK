import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <Calendar size={28} />
          ExpertBook
        </Link>
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Find Experts
          </Link>
          <Link to="/my-bookings" className={`nav-link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>
            My Bookings
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
