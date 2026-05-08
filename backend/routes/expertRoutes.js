const express = require('express');
const router = express.Router();
const expertController = require('../controllers/expertController');

router.get('/', expertController.getExperts);
router.get('/:id', expertController.getExpertById);

module.exports = router;
