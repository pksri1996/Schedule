const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DesignationAssignmentSchema = new Schema({
  zones: {
    East: { type: Schema.Types.ObjectId, ref: 'Zone' },
    West: { type: Schema.Types.ObjectId, ref: 'Zone' },
    North: { type: Schema.Types.ObjectId, ref: 'Zone' },
    South: { type: Schema.Types.ObjectId, ref: 'Zone' },
    Central: { type: Schema.Types.ObjectId, ref: 'Zone' }
  },
  reserves: [{ type: Schema.Types.ObjectId, ref: 'Employee' }]
});

module.exports = mongoose.model('DesignationAssignment', DesignationAssignmentSchema);
