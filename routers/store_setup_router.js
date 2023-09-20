const express = require("express");
const router = express.Router();
const cotroller = require('../controller/store_setup_cotroller');
const { verify0 } = require('../middleware/Authentication');
const upload = require("../middleware/multer");

router.post('/storesetup', verify0, upload.single('image'), cotroller.store_setup);
router.get('/accountinfo', verify0, cotroller.account_info);
module.exports = router;