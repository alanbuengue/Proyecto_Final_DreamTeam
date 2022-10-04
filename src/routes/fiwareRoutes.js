const fiwareController = require('../controllers/fiwareController');
const express = require('express');
const router = express.Router();

router.get('/orion', fiwareController.getVersion);
router.get('/orion/entities', fiwareController.getOrionEntities);

module.exports = router;