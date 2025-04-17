const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplacementSchema = new Schema({
  originalEmployee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  replacementEmployee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  dates: [{ type: Date, required: true }]
});

module.exports = mongoose.model('Replacement', ReplacementSchema);
