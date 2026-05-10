const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Add socket.io to request object so it can be used in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expert-booking';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    
    // Seed data on startup
    const Expert = require('./models/Expert');
    const Booking = require('./models/Booking');
    const count = await Expert.countDocuments();
    if (count === 0) {
      console.log('Seeding initial data...');
      const expertsData = [
        {
          name: 'Dr. Sarah Connor',
          category: 'Technology',
          experience: 12,
          rating: 4.8,
          bio: 'Expert in Artificial Intelligence and Software Architecture.',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'John Doe',
          category: 'Business',
          experience: 8,
          rating: 4.5,
          bio: 'Business consultant specializing in startups and scaling.',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Jane Smith',
          category: 'Health',
          experience: 15,
          rating: 4.9,
          bio: 'Certified nutritionist and wellness coach.',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600'
        },
        {
          name: 'Michael Scott',
          category: 'Management',
          experience: 20,
          rating: 4.2,
          bio: 'Regional Manager with extensive experience in paper sales and team leadership.',
          image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600'
        }
      ];
      await Expert.insertMany(expertsData);
      console.log('Database seeded successfully!');
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

connectDB();

// Routes
const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
