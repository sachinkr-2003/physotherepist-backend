const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  condition: { type: String, required: true },
  treatment: { type: String, required: true },
  notes: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
