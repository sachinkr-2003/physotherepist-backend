const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getMyHistory,
  getAllPatients,
  getPatientDetails,
  addMedicalHistory
} = require('../controllers/userController');
const { protect, adminProtect } = require('../middleware/authMiddleware');

// Patient Routes
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.get('/history', protect, getMyHistory);

// Admin Routes
router.get('/patients', protect, adminProtect, getAllPatients);
router.get('/patients/:id', protect, adminProtect, getPatientDetails);
router.post('/patients/:id/history', protect, adminProtect, addMedicalHistory);

module.exports = router;
