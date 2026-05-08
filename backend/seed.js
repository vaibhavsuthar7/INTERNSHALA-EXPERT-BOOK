const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expert = require('./models/Expert');
const Booking = require('./models/Booking');

dotenv.config();

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
  },
  {
    name: 'Dr. House',
    category: 'Health',
    experience: 25,
    rating: 4.7,
    bio: 'Diagnostician specializing in infectious diseases.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Ada Lovelace',
    category: 'Technology',
    experience: 10,
    rating: 5.0,
    bio: 'Pioneer programmer and algorithmic thinker.',
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=600'
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB connected for seeding');
  
  await Expert.deleteMany({});
  await Booking.deleteMany({});
  
  await Expert.insertMany(expertsData);
  console.log('Database seeded!');
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
