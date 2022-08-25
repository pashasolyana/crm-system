const express = require('express');
const router = express.Router()
const controller = require('../controllers/analytics')

router.get('/overview',passport.authenticate('jwt', {session : false}), controller.overview)
router.get('/analytics',passport.authenticate('jwt', {session : false}), controller.analytics)

module.exports = router;