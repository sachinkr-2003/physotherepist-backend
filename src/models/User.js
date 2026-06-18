const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'admin'], default: 'patient' },
  patientId: { type: String, unique: true, sparse: true },
  email: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: { type: String },
  bloodGroup: { type: String },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  // Generate a unique patientId if not present and user is a patient
  if (this.isNew && this.role === 'patient' && !this.patientId) {
    const count = await mongoose.model('User').countDocuments({ role: 'patient' });
    this.patientId = `VKP-${1000 + count + 1}`;
  }

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
