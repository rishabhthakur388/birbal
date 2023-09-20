const express = require("express");
const router = express.Router();
const controller = require('../controller/cart_controller');
const { verify } = require('../middleware/Authentication');
const { verify0 } = require('../middleware/Authentication');

router.post('/cart',verify, controller.cart);
router.get('/getcart',verify, controller.showCart);
router.post('/editCart',verify, controller.editCart);
router.post('/verifydelivery',verify, controller.Verifydelivery);
router.post('/order',verify, controller.order);
router.post('/verify_delivery_otp',verify, controller.verify_delivery_otp);
router.post('/add_address',verify, controller.add_address);
router.get('/checkout',verify, controller.checkout);
router.get('/account',verify, controller.account);
router.get('/service_provider_orderlists',verify0, controller.service_provider_orderlists);
router.get('/service_provider_response',verify0, controller.service_provider_response);
router.get('/show_order',verify, controller.show_order);
router.get('/cancel_order',verify, controller.cancel_order);
router.get('/productsdetails',controller.products_details);

module.exports = router;