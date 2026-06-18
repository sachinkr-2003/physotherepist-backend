const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, getAllContacts);

module.exports = router;
