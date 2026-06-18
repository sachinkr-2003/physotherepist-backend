const User = require('../models/User');
const MedicalHistory = require('../models/MedicalHistory');
const Appointment = require('../models/Appointment');

// Patient: Get own profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient: Update own profile
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email !== undefined ? req.body.email : user.email;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;
    user.bloodGroup = req.body.bloodGroup || user.bloodGroup;

    if (req.body.password) {
      user.password = req.body.password; // pre-save hook hashes it
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      mobile: updatedUser.mobile,
      email: updatedUser.email,
      patientId: updatedUser.patientId,
      role: updatedUser.role,
      age: updatedUser.age,
      gender: updatedUser.gender,
      address: updatedUser.address,
      bloodGroup: updatedUser.bloodGroup
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patient: Get own medical history
const getMyHistory = async (req, res) => {
  try {
    const history = await MedicalHistory.find({ patient: req.user._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get specific patient detail
const getPatientDetails = async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select('-password');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const history = await MedicalHistory.find({ patient: patient._id }).sort({ date: -1 });
    const appointments = await Appointment.find({ user: patient._id }).sort({ date: -1 });

    res.json({ patient, history, appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Add medical history to a patient
const addMedicalHistory = async (req, res) => {
  try {
    const { condition, treatment, notes } = req.body;
    const history = await MedicalHistory.create({
      patient: req.params.id,
      condition,
      treatment,
      notes,
    });
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getMyHistory,
  getAllPatients,
  getPatientDetails,
  addMedicalHistory
};
