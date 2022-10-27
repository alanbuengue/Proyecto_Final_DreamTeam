const fiwareController = require('../controllers/fiwareController');
const express = require('express');
const router = express.Router();

// Orion
router.get('/orion', fiwareController.getVersion);
router.get('/orion/entities', fiwareController.getOrionEntities);
router.post('/orion/entities', fiwareController.createOrionEntity);
// rememmber to send id by post
router.delete('/orion/entities',fiwareController.deleteEntity);

// IOT Agent
router.post('/iot', fiwareController.sendSensorData);
router.get('/iot', fiwareController.getSensorData);

router.get('/iot/services',fiwareController.getIotServices);
router.post('/iot/services',fiwareController.createIotService);

router.post('/iot/devices',fiwareController.createIotDevice);

module.exports = router;
