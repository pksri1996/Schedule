const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ZoneSchema = new Schema({
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  replacements: [{ type: Schema.Types.ObjectId, ref: 'Replacement' }]
});

module.exports = mongoose.model('Zone', ZoneSchema);
