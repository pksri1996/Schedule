const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const scheduleSchema = new Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  assignments: [
    {
      zone: {
        type: String,
        enum: ['Central', 'East', 'West', 'North', 'South'],
        required: true
      },
      employees: {
        type: [String], // Array of employee IDs
        required: true
      },
      replacements: {
        type: [String], // Array of employee IDs replacing those on leave
        default: []
      }
    }
  ],
  reserves: {
    type: [String], 
    default: []
  },
  employeesOnLeave: {
    type: [String], 
    default: []
  }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
