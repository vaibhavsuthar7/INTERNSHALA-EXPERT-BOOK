const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);
