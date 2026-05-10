import { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, CheckCircle, Clock as ClockIcon } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_URL = `${BACKEND_URL}/api`;

const MyBookings = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/bookings`, {
        params: { email }
      });
      setBookings(res.data);
      setHasSearched(true);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return { bg: '#ECFDF5', text: '#065F46', icon: <CheckCircle size={16} /> };
      case 'Completed': return { bg: '#EFF6FF', text: '#1E40AF', icon: <CheckCircle size={16} /> };
      default: return { bg: '#FFFBEB', text: '#B45309', icon: <ClockIcon size={16} /> };
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
          My Bookings
        </h1>

        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <form onSubmit={fetchBookings} className="flex gap-4">
            <input 
              type="email" 
              className="input" 
              placeholder="Enter your email address to find bookings..." 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {hasSearched && !loading && bookings.length === 0 && (
          <div className="text-center text-muted" style={{ padding: '40px' }}>
            No bookings found for this email address.
          </div>
        )}

        {bookings.length > 0 && (
          <div className="grid grid-cols-1">
            {bookings.map(booking => {
              const statusStyle = getStatusColor(booking.status);
              
              return (
                <div key={booking._id} className="card" style={{ padding: '20px' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                        Session with {booking.expertId?.name || 'Expert'}
                      </h3>
                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {booking.expertId?.category || 'Category'}
                      </span>
                    </div>
                    <div 
                      className="badge flex items-center gap-1" 
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '6px 12px' }}
                    >
                      {statusStyle.icon} {booking.status}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px' }}>
                    <div className="flex gap-4 mb-2">
                      <div className="flex items-center gap-2 text-muted" style={{ width: '50%' }}>
                        <Calendar size={16} /> <span style={{ fontWeight: 500, color: '#111827' }}>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted">
                        <Clock size={16} /> <span style={{ fontWeight: 500, color: '#111827' }}>{booking.timeSlot}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <User size={16} /> <span>{booking.userName}</span> ({booking.userPhone})
                    </div>
                    {booking.notes && (
                      <div className="mt-2 text-muted" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                        " {booking.notes} "
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
