import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Star, Users, Briefcase, Calendar as CalIcon } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api`;

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  // Hero section active expert
  const [activeExpert, setActiveExpert] = useState(null);

  const categories = ['Technology', 'Business', 'Health', 'Management'];

  useEffect(() => {
    fetchExperts();
  }, [search, category]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/experts`, {
        params: { search, category, page: 1, limit: 10 }
      });
      setExperts(res.data.experts);
      if (res.data.experts.length > 0) {
        setActiveExpert(res.data.experts[0]);
      } else {
        setActiveExpert(null);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch experts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-page-wrapper">
      {/* BACKGROUND STYLING MATCHING THE REFERENCE IMAGE */}
      <div className="hero-background"></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '40px' }}>
        
        {/* HERO SECTION */}
        <div className="hero-grid">
          
          {/* LEFT: Text Content */}
          <div className="hero-text-section">
            <h1 className="hero-title">
              Book Experts<br />
              Easily Learn<br />
              Smarter
            </h1>
            <p className="hero-subtitle">
              Search top professionals, compare their experience, and book your next 1-on-1 session instantly.
            </p>
          </div>

          {/* CENTER: 3D-like Expert Image */}
          <div className="hero-center-image">
            {activeExpert ? (
              <div className="expert-3d-wrapper">
                <img 
                  src={activeExpert.image} 
                  alt={activeExpert.name} 
                  className="expert-3d-img"
                />
                <div className="expert-floating-badge">
                  <Star size={16} fill="#8B5CF6" color="#8B5CF6" />
                  <span style={{ fontWeight: 800 }}>{activeExpert.rating}</span>
                  <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>(1.2k)</span>
                </div>
              </div>
            ) : (
              <div className="expert-3d-placeholder">No Expert Found</div>
            )}
          </div>

          {/* RIGHT: Stats / Details */}
          <div className="hero-stats-section">
            <div className="stat-pill">
              <Users size={16} className="stat-icon" />
              <span>50+ Top Experts</span>
            </div>
            <div className="stat-pill">
              <Briefcase size={16} className="stat-icon" />
              <span>4+ Categories</span>
            </div>
            <div className="stat-pill">
              <CalIcon size={16} className="stat-icon" />
              <span>Instant Booking</span>
            </div>
          </div>
        </div>

        {/* BOTTOM: Floating Search/Filter Bar (Like the Flight booking bar) */}
        <div className="hero-search-bar">
          <div className="search-tabs">
            <label className="search-tab active"><input type="radio" checked readOnly /> Find Expert</label>
            <label className="search-tab text-muted"><input type="radio" disabled /> Mentorship</label>
            <label className="search-tab text-muted"><input type="radio" disabled /> Consultation</label>
          </div>
          
          <div className="search-inputs">
            <div className="search-field">
              <Search size={20} className="field-icon" />
              <div>
                <div className="field-label">Search Name</div>
                <input 
                  type="text" 
                  className="field-input" 
                  placeholder="e.g. Sarah Connor"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="field-divider"></div>

            <div className="search-field">
              <Briefcase size={20} className="field-icon" />
              <div>
                <div className="field-label">Category</div>
                <select 
                  className="field-input" 
                  style={{ cursor: 'pointer' }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="field-divider"></div>
            
            {activeExpert && (
              <Link to={`/expert/${activeExpert._id}`} className="btn-search">
                Book {activeExpert.name.split(' ')[0]}
              </Link>
            )}
          </div>
        </div>

        {/* HORIZONTAL SCROLLING EXPERTS LIST */}
        <div className="experts-scroll-section mt-4">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', fontWeight: 700 }}>More Experts</h2>
          
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {loading ? (
             <div className="spinner"></div>
          ) : experts.length === 0 ? (
             <div className="text-center text-muted" style={{ padding: '40px 0' }}>No experts found matching your criteria.</div>
          ) : (
            <div className="horizontal-scroll-container">
              {experts.map(expert => (
                <div 
                  key={expert._id} 
                  className={`scroll-card ${activeExpert?._id === expert._id ? 'active' : ''}`}
                  onClick={() => setActiveExpert(expert)}
                >
                  <img src={expert.image} alt={expert.name} className="scroll-card-img" />
                  <div className="scroll-card-content">
                    <span className="badge badge-primary" style={{ marginBottom: '8px' }}>{expert.category}</span>
                    <h3 className="scroll-card-title">{expert.name}</h3>
                    <p className="scroll-card-exp">{expert.experience} yrs exp</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExpertList;
