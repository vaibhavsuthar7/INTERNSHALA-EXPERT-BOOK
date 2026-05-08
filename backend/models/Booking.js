const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  timeSlot: { type: String, required: true }, // Format: HH:MM AM/PM
  notes: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' }
}, { timestamps: true });

// Prevent double booking at the DB level
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
