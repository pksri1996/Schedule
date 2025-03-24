const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  designationAssignments: [{
    designation: { type: String, enum: ['TSI', 'HC', 'C'], required: true },
    assignment: { type: Schema.Types.ObjectId, ref: 'DesignationAssignment' }
  }],
  onLeaveEmployees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);
