const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const { expertId, userName, userEmail, userPhone, date, timeSlot, notes } = req.body;

    // Basic validation
    if (!expertId || !userName || !userEmail || !userPhone || !date || !timeSlot) {
      return res.status(400).json({ error: 'All fields except notes are required' });
    }

    // Explicit check for double booking to give a nice error message before DB throws
    const existingBooking = await Booking.findOne({ expertId, date, timeSlot });
    if (existingBooking) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    const booking = new Booking({
      expertId, userName, userEmail, userPhone, date, timeSlot, notes
    });

    await booking.save();

    // Emit event to update clients in real-time
    if (req.io) {
      req.io.emit('slot_booked', { expertId, date, timeSlot });
    }

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const bookings = await Booking.find({ userEmail: email }).populate('expertId', 'name category');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['Pending', 'Confirmed', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Status updated', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
