const express = require('express');
const router = express.Router();
const { bookAppointment, getMyAppointments, getAllAppointments, updateStatus } = require('../controllers/appointmentController');
const { protect, optionalProtect, adminProtect } = require('../middleware/authMiddleware');

router.post('/', optionalProtect, bookAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/all', protect, adminProtect, getAllAppointments);
router.put('/:id', protect, adminProtect, updateStatus);

module.exports = router;
