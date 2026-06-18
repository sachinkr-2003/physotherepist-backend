const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
  const { name, mobile, password } = req.body;
  if (!name || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
    return res.status(400).json({ message: 'Mobile number must be 10 digits' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  try {
    const exists = await User.findOne({ mobile });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, mobile, password });
    res.status(201).json({ _id: user._id, name: user.name, mobile: user.mobile, email: user.email, patientId: user.patientId, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { mobile, password } = req.body;
  try {
    const user = await User.findOne({ mobile });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ _id: user._id, name: user.name, mobile: user.mobile, email: user.email, patientId: user.patientId, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
