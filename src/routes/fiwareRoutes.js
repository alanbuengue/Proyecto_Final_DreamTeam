const fiwareController = require('../controllers/fiwareController');
const express = require('express');
const router = express.Router();

// Orion
router.get('/orion', fiwareController.getVersion);
router.get('/orion/entities', fiwareController.getOrionEntities);
router.post('/orion/entities', fiwareController.createOrionEntity);


// IOT Agent
router.post('/iot', fiwareController.sendSensorData);
router.get('/iot', fiwareController.getSensorData);

router.post('/iot/services',fiwareController.createIotService);

module.exports = router;
