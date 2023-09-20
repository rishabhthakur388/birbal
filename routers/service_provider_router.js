const express = require("express");
const router = express.Router();
const service_provider_controller = require('../controller/service_provider_controller');
const {verify0} = require('../middleware/Authentication')
const upload = require("../middleware/multer");

router.post('/signup',service_provider_controller.signUp);
router.post('/verification',upload.single('profile_picture'),service_provider_controller.verification);
router.post('/forgotpassword',service_provider_controller.forgot_password);
router.post('/login',service_provider_controller.login);
router.get('/token',verify0,service_provider_controller.get_token)

module.exports = router;