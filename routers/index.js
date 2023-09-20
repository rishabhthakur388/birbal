const express = require('express')
const router = express.Router();

router.use('/', require('./service_provider_router'));
router.use('/', require('./store_setup_router'));
router.use('/', require('./prdoucts_router'));
router.use('/', require('./cart_router'));


module.exports = router;