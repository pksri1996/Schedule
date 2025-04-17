const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  preferredZones: {
    type: [String],
    enum: ['East', 'West', 'North', 'South'],
    validate: {
      validator: function (zones) {
        return zones.length === 2; // Ensure exactly 2 preferred zones
      },
      message: 'Must have exactly 2 preferred zones'
    },
    required: true
  },
  centralZoneDays: {
    type: Number,
    default: 0 // Tracks the number of days worked in the central zone
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Reserve'],
    default: 'Active'
  },
  designation:{
    type: String,
    enum: ['TSI', 'HC', 'C'],
    default: 'C'
  },
  Ldate: {
     type: Date,
     default: new Date('1900-04-01') // This is for the last date of working in central zone
    },
    leaveDates: {
      type: [Date],
      default: []
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
