const db = require('../models/index');
const PRODUCTS = db.products;
const CATEGORY = db.category;
const SUB_CATEGORY = db.sub_category;
const resp = require("../helper/response");


////////////////////////////////ADD CATEGORY/////////////////////////////////////////////////
exports.add_category = async (req, res) => {
    try {
        const reqBody = req.body;
        const findData = await CATEGORY.findOne({ where: { category_name: reqBody.category_name } })
        if (findData) {
            return resp.failedResponseWithMsg(res, 'CATEGORY_ALLREADY_EXISTS')
        }
        const payload = {
            category_name: reqBody.category_name
        }
        const data = await CATEGORY.create(payload);
        return resp.successResponse(res, "SUCCESS", data)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};


////////////////////////////// ADD SUB CATEGORY////////////////////////////////////////////////
exports.add_sub_category = async (req, res) => {
    try {
        const reqBody = req.body;
        const findData = await SUB_CATEGORY.findOne({
            where: {

                sub_category_name: reqBody.sub_category_name
            }
        })
        if (findData) {
            return resp.failedResponseWithMsg(res, 'CATEGORY_ALLREADY_EXISTS')
        }
        const payload = {
            category_id: reqBody.category_id,
            sub_category_name: reqBody.sub_category_name
        }
        const data = await SUB_CATEGORY.create(payload);
        return resp.successResponse(res, "SUCCESSS", data)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

/////////////////////////////// PRODUCTS//////////////////////////////////////////////////////
exports.products = async (req, res) => {
    try {
        const reqBody = req.body;
        const checkCAT = await SUB_CATEGORY.findOne({ where: { category_id: reqBody.category, id: reqBody.sub_category } })
        // console.log(checkCAT, "=================");
        if (!checkCAT) {
            return resp.failedResponseWithMsg(res, "NOT_MATCHED");
        };
        const findData = await PRODUCTS.findOne({
            where: {
                barcode: reqBody.barcode
            }
        })
        if (findData) {
            return resp.failedResponseWithMsg(res, 'CATEGORY_ALLREADY_EXISTS')
        }
        const playload = {
            sellers_id: req.currentUser.id,
            image: req.file.filename,
            barcode: reqBody.barcode,
            product_name: reqBody.product_name,
            category_id: reqBody.category,
            sub_category_id: reqBody.sub_category,
            mrp: reqBody.mrp,
            selling_price: reqBody.selling_price,
            quantity: reqBody.quantity,
            quantity_type: reqBody.quantity_type,
            product_details: reqBody.product_details,
            available: reqBody.available,
            size_color: reqBody.size_color,
            size: reqBody.size,
            color: reqBody.color
        }
        const data = await PRODUCTS.create(playload);
        return resp.successResponse(res, "SUCCESS", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }

};

////////////////////////////////categoriesOrSubCategories////////////////////////////////////
exports.categoriesOrSubCategories = async (req, res) => {
    try {
        const findCartORsubCat = await CATEGORY.findAll({
            attributes: ['id', 'category_name', [db.Sequelize.literal(`(select count(id) from sub_categories where  category_id = CATEGORY.id)`), "count"]],
            include: { model: SUB_CATEGORY, attributes: ['id', 'sub_category_name'] }
        });


        return resp.successResponse(res, "SUCCESS", findCartORsubCat);
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

///////////////////////////////////catalog///////////////////////////////////////////////////
exports.catalog = async (req, res) => {
    try {
        const findData = await PRODUCTS.findAll({
            where: { sellers_id: req.currentUser.id },
            attributes: ['id', 'image', 'product_name', 'product_details', 'sellers_id'],
            include: { model: CATEGORY }
        })
        return resp.successResponse(res, "SUCCESS", findData);
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};


/////////////////////////////////////products_details////////////////////////////////////////
exports.products_details = async (req, res) => {
    try {
        const reqQuery = req.query;
        const findProduct = await PRODUCTS.findOne({
            where: { sellers_id: req.currentUser.id },
            include: [{ model: CATEGORY, attributes: ['id', 'category_name'] }, { model: SUB_CATEGORY, attributes: ['id', 'sub_category_name'] }]
        })
        if (!findProduct) {
            return resp.failedResponseWithMsg(res, "PRODUCT_NOT_FOUND")
        }
        return resp.successResponse(res, "SUCCESS", findProduct)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

////////////////////////////////SELLERSDETAILS//////////////////////////////////////////////
exports.sellersDetails = async (req, res) => {
    try {
        const reqQuery = req.query;
        const findProduct = await PRODUCTS.findAll({
            where: { sellers_id: reqQuery.sellers_id },
            attributes: ['product_name', "category_id", "sub_category_id"]
        })
        if (findProduct.length == 0) {
            return resp.failedResponseWithMsg(res, "SELLER_NOT_FOUND")
        }
        return resp.successResponse(res, "SUCCESS", findProduct)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

//////////////////////////////////edit_product_details//////////////////////////////////////
exports.edit_product_details = async (req, res) => {
    try {
        const reqBody = req.body;
        const findUser = await PRODUCTS.findOne({ where: { sellers_id: req.currentUser.id, id: reqBody.id } })
        if (!findUser) {
            return resp.failedResponseWithMsg(res, "PRODUCT_NOT_FOUND")
        }
        // console.log(findUser)
        const data = await PRODUCTS.update({
            id: reqBody.id,
            image: reqBody.image,
            product_name: reqBody.product_name,
            product_details: reqBody.product_details,
            mrp: reqBody.mrp,
            selling_price: reqBody.selling_price,
            size: reqBody.size,
            color: reqBody.color
        },
            { where: { id: reqBody.id } })

        return resp.successResponse(res, "DONE", data)


    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

///////////////////////////////////productListing//////////////////////////////////////////
exports.productListing = async (req, res) => {
    try {
        const reQuery = req.query;
        const findProduct = await PRODUCTS.findAll({
            where:


                { category_id: reQuery.category_id },
            include: { model: CATEGORY, attributes: ['category_name'] }
        })
        if (findProduct.length == 0) {
            return resp.failedResponseWithMsg(res, "SORRY_NOT_ITEM_FOUND")
        }
        return resp.successResponse(res, "DONE", findProduct)
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

////////////////////////////search//////////////////////////////////////////////////////////
exports.search = async (req, res) => {
    try {
        const reqQuery = req.query;
        const findProduct = await PRODUCTS.findAll({
            where: { product_name: reqQuery.product_name },
            include: { model: CATEGORY },
            include: { model: SUB_CATEGORY }
            // [Op.or]:
            //     [
            //         { product_name: reqQuery.product_name },
            //         { category_name: reqQuery.category_name },
            //         { sub_category_name: { [Op.like]: "%" + reqQuery.sub_category_name + "%" } }
            //     ],
        })
        console.log(findProduct)
        if (findProduct.length == 0) {
            return resp.failedResponse(res, "ITEM_NOT_FOUND")
        }
        return resp.successResponse(res, "SUCCESS", findProduct)
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

////////////////////////////getBussinessCategory////////////////////////////////////////////
exports.getBussinessCategory = async (req, res) => {
    try {
        const findUser = await PRODUCTS.findAll({
            where: { sellers_id: req.query.sellers_id },
            // include: { model: SERVICEPROVIDER },
            // include: { model: CATEGORY, attributes: ['category_name'] }, 
            // include: { model: SUB_CATEGORY, attributes: ['sub_category_name'] }
        })

        return resp.successResponse(res, "SUCCESS", findUser)
    }
    catch (error) {
        return resp.failedResponse(res, error.message)
    }
};