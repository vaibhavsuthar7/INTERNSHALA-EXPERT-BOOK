import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Star, Clock, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [expert, setExpert] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  const selectedDateRef = useRef(selectedDate);
  const selectedSlotRef = useRef(selectedSlot);
  const bookingLoadingRef = useRef(bookingLoading);

  // Keep refs updated with latest state without triggering re-renders
  useEffect(() => {
    selectedDateRef.current = selectedDate;
    selectedSlotRef.current = selectedSlot;
    bookingLoadingRef.current = bookingLoading;
  }, [selectedDate, selectedSlot, bookingLoading]);

  useEffect(() => {
    fetchExpertDetails();
  }, [id]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    
    socket.on('slot_booked', (data) => {
      if (data.expertId === id) {
        // Remove booked slot from schedule
        setSchedule(prevSchedule => {
          return prevSchedule.map(day => {
            if (day.date === data.date) {
              return {
                ...day,
                slots: day.slots.filter(slot => slot !== data.timeSlot)
              };
            }
            return day;
          });
        });

        // Use refs to check current state to avoid reconnecting socket
        if (
          selectedDateRef.current === data.date && 
          selectedSlotRef.current === data.timeSlot && 
          !bookingLoadingRef.current
        ) {
          setSelectedSlot('');
          setBookingError('Sorry, this slot was just booked by someone else.');
        }
      }
    });

    return () => socket.disconnect();
  }, [id]);

  const fetchExpertDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/experts/${id}`);
      setExpert(res.data.expert);
      setSchedule(res.data.schedule);
      if (res.data.schedule.length > 0) {
        setSelectedDate(res.data.schedule[0].date);
      }
    } catch (err) {
      setError('Failed to fetch expert details.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingError(null);
    setBookingMessage(null);
    
    if (!selectedSlot) {
      setBookingError('Please select a time slot.');
      return;
    }

    try {
      setBookingLoading(true);
      const payload = {
        expertId: id,
        date: selectedDate,
        timeSlot: selectedSlot,
        ...formData
      };
      
      await axios.post(`${API_URL}/bookings`, payload);
      
      setBookingMessage('Booking successful! We will confirm your session soon.');
      setBookingError(null); // Clear any socket errors that might have appeared
      setFormData({ userName: '', userEmail: '', userPhone: '', notes: '' });
      setSelectedSlot('');
      
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (error || !expert) return <div className="container"><div className="alert alert-error">{error || 'Expert not found'}</div></div>;

  const currentDaySchedule = schedule.find(s => s.date === selectedDate);

  return (
    <div className="container">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary mb-4 gap-2"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Left Col: Details & Slots */}
        <div>
          <div className="card mb-4" style={{ padding: '24px' }}>
            <div className="flex gap-4 items-center mb-4">
              <img 
                src={expert.image} 
                alt={expert.name} 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{expert.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="badge badge-primary">{expert.category}</span>
                  <div className="flex items-center gap-1 text-muted" style={{ fontSize: '0.9rem' }}>
                    <Star size={16} fill="#F59E0B" color="#F59E0B" /> {expert.rating}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-muted">{expert.bio}</p>
            <div className="mt-4" style={{ fontWeight: 500 }}>
              {expert.experience} Years of Experience
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={20} className="text-muted" /> Select Date & Time
            </h2>
            
            <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
              {schedule.map(day => {
                const d = new Date(day.date);
                const isSelected = selectedDate === day.date;
                return (
                  <button
                    key={day.date}
                    onClick={() => { setSelectedDate(day.date); setSelectedSlot(''); }}
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ minWidth: '80px', flexDirection: 'column', gap: '4px', padding: '8px' }}
                  >
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      {d.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span style={{ fontWeight: 700 }}>
                      {d.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>

            <h3 style={{ fontSize: '1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} className="text-muted" /> Available Slots
            </h3>

            {currentDaySchedule && currentDaySchedule.slots.length > 0 ? (
              <div className="slot-grid">
                {currentDaySchedule.slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <div className="alert alert-error" style={{ padding: '12px', fontSize: '0.9rem' }}>
                No slots available for this date.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Booking Form */}
        <div>
          <div className="card" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Complete Booking</h2>
            
            {bookingMessage && <div className="alert alert-success">{bookingMessage}</div>}
            {bookingError && <div className="alert alert-error">{bookingError}</div>}

            <form onSubmit={handleBook}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="input" 
                  required 
                  value={formData.userName}
                  onChange={e => setFormData({...formData, userName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="input" 
                  required 
                  value={formData.userEmail}
                  onChange={e => setFormData({...formData, userEmail: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input 
                  type="tel" 
                  className="input" 
                  required 
                  value={formData.userPhone}
                  onChange={e => setFormData({...formData, userPhone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea 
                  className="textarea" 
                  rows="3"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              <div style={{ backgroundColor: '#F3F4F6', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">Date:</span>
                  <span style={{ fontWeight: 600 }}>{selectedDate || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">Time:</span>
                  <span style={{ fontWeight: 600 }}>{selectedSlot || '-'}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={!selectedSlot || bookingLoading}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetail;
