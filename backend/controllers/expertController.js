const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

// Utility to generate next 7 days and available slots
const generateSlots = () => {
  const dates = [];
  const today = new Date();
  
  // Working hours: 9 AM to 5 PM
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    dates.push({ date: dateStr, slots: timeSlots });
  }
  return dates;
};

exports.getExperts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;

    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const experts = await Expert.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Expert.countDocuments(query);

    res.json({
      experts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getExpertById = async (req, res) => {
  try {
    const expertId = req.params.id;
    const expert = await Expert.findById(expertId);

    if (!expert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    // Get all bookings for this expert
    const bookings = await Booking.find({ expertId });

    // Generate upcoming slots
    const availableDates = generateSlots();

    // Remove booked slots
    const schedule = availableDates.map((day) => {
      const dayBookings = bookings.filter(b => b.date === day.date);
      const bookedTimeSlots = dayBookings.map(b => b.timeSlot);

      const availableSlots = day.slots.filter(slot => !bookedTimeSlots.includes(slot));
      
      return {
        date: day.date,
        slots: availableSlots
      };
    });

    res.json({
      expert,
      schedule
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
