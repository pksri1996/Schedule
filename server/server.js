if (process.env.NODE_ENV !== 'development') {
  require('dotenv').config(); // Only load .env in production
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const employeeRoutes = require('./routes/employee');
const scheduleRoutes = require('./routes/schedules');

// Environment variables with development defaults
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/schedulingApp';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Mongoose connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API routes
app.use('/api/employees', employeeRoutes);
app.use('/api/schedules', scheduleRoutes);

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
