const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');


const employeeRoutes = require('./routes/employee');
const scheduleRoutes = require('./routes/schedules');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());




mongoose.connect('mongodb://127.0.0.1:27017/schedulingApp')
    .then(() => console.log('Mongoose connected'))
    .catch(err => console.log('Connection error:', err));
    

app.use('/api/employees', employeeRoutes);
app.use('/api/schedules', scheduleRoutes);

const port = 5173;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});