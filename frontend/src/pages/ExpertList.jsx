import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Star } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api`;

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Technology', 'Business', 'Health', 'Management'];

  useEffect(() => {
    fetchExperts();
  }, [search, category, page]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/experts`, {
        params: { search, category, page, limit: 6 }
      });
      setExperts(res.data.experts);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch experts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4 mt-4" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Find an Expert</h1>
        
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#6B7280' }} />
            <input
              type="text"
              placeholder="Search by name..."
              className="input"
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select 
            className="select" 
            style={{ width: '200px' }}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : experts.length === 0 ? (
        <div className="text-center text-muted" style={{ padding: '60px 0' }}>
          No experts found matching your criteria.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
            {experts.map(expert => (
              <div key={expert._id} className="card">
                <img 
                  src={expert.image} 
                  alt={expert.name} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '20px' }}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="badge badge-primary">{expert.category}</span>
                    <div className="flex items-center gap-2" style={{ color: '#F59E0B', fontWeight: 600 }}>
                      <Star size={16} fill="#F59E0B" /> {expert.rating}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{expert.name}</h3>
                  <p className="text-muted mb-4" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {expert.bio}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {expert.experience} yrs exp
                    </span>
                    <Link to={`/expert/${expert._id}`} className="btn btn-primary">
                      Book Session
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4" style={{ paddingTop: '20px' }}>
              <button 
                className="btn btn-secondary"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="text-muted">Page {page} of {totalPages}</span>
              <button 
                className="btn btn-secondary"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpertList;
