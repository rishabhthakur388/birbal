const express = require("express");
const router = express.Router();
const controller = require('../controller/products_controller');
const { verify0 } = require('../middleware/Authentication');
const upload = require("../middleware/multer");

router.post('/products', verify0, upload.single('image'), controller.products);
router.post('/addcategory', controller.add_category);
router.post('/addsubcategory', controller.add_sub_category);
router.get('/getcategories', controller.categoriesOrSubCategories);
router.get('/catalog', verify0, controller.catalog);
router.get('/productdetails', verify0, controller.products_details);
router.get('/sellersDetails', controller.sellersDetails);
router.post('/editproductdetails', verify0, upload.single('image'), controller.edit_product_details);
router.get('/productListing', controller.productListing);
router.get('/searchproduct', controller.search);
router.get('/BussinessCategory', controller.getBussinessCategory);
module.exports = router;    