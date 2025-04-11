const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');
const authenticateToken = require('../middleware/authmiddleware');

// Public
router.get('/', seatController.getSeats);

// Protected
router.post('/book', authenticateToken, seatController.bookSeats);
router.post('/reset', authenticateToken, seatController.resetSeats);

module.exports = router;
