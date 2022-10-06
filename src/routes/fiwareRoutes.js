const fiwareController = require('../controllers/fiwareController');
const express = require('express');
const router = express.Router();

// Orion
router.get('/orion', fiwareController.getVersion);
router.get('/orion/entities', fiwareController.getOrionEntities);

// IOT Agent
router.post('/iot', fiwareController.sendSesorData);
router.get('/iot', fiwareController.getSensorData);

module.exports = router;
