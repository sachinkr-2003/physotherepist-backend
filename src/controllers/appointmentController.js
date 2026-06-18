const Appointment = require('../models/Appointment');

const bookAppointment = async (req, res) => {
  const { fullName, mobileNumber, service, date, timeSlot } = req.body;
  if (!fullName || !mobileNumber || !service || !date || !timeSlot) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
    return res.status(400).json({ message: 'Mobile number must be 10 digits' });
  }
  try {
    const appointment = await Appointment.create({
      user: req.user?._id,
      fullName, mobileNumber, service, date, timeSlot
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { bookAppointment, getMyAppointments, getAllAppointments, updateStatus };
