const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookingsByEmail);
router.patch('/:id/status', bookingController.updateBookingStatus);

module.exports = router;
