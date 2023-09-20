const db = require('../models/index');
const CART = db.cart;
const ORDER = db.order;
const resp = require("../helper/response");
const PRODUCTS = db.products;
const CUSTOMERS = db.customers;
const ADDRESS = db.address;
const CATEGORY = db.category;
const SUB_CATEGORY = db.sub_category;

function generateUniqueCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const uniqueCode = Array.from({ length }, () => {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters.charAt(randomIndex);
    }).join('');

    return uniqueCode;
};

//////////////////////////////////// CART /////////////////////////////////////////////////////
exports.cart = async (req, res) => {
    try {
        const reqBody = req.body;
        const findCart = await CART.findOne({
            where: { product_id: reqBody.product_id, customer_id: req.currentUser.id, cart_status: 1, quantity: 1 },
            include: { model: PRODUCTS, attributes: ['id', 'product_name', 'image', 'quantity', 'selling_price'] }
        });
        if (findCart) {
            return resp.failedResponseWithMsg(res, 'ITEM_ALLREADY_EXISTS');
        };
    //   if(findCart == 0){};

        const payload = {
            product_id: reqBody.product_id,
            quantity: reqBody.quantity,
            customer_id: req.currentUser.id,
            cart_status: reqBody.cart_status,
        }
        const data = await CART.create(payload);
        return resp.successResponse(res, "SUCCESS", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

///////////////////////// edit ITEM ///////////////////////////////////////////////////////////
exports.editCart = async (req, res) => {
    try {
        const reqBody = req.body;
        const findItem = await CART.findAll({
            where: { product_id: reqBody.product_id, customer_id: req.currentUser.id, cart_status: 1 }
        });
        if (!findItem) {
            return resp.failedResponseWithMsg(res, "ITEM_NOT_FOUND")
        };
        const update = await CART.update({ quantity: req.body.quantity }, { where: { product_id: reqBody.product_id, customer_id: req.currentUser.id, cart_status: 1 } });
        if (reqBody.quantity == 0) {
            await CART.destroy({ where: { product_id: req.body.product_id } })
        }
        return resp.successResponse(res, "success", update)
    } catch (error) {
        return resp.failedResponseWithMsg(res, "ITEM_NOT_FOUND")
    }
};

/////////////////////////////////////  Delivery OTP //////////////////////////////////////////
exports.Verifydelivery = async (req, res) => {
    try {
        const reqBody = req.body;
        // const findData = await ORDER.findOne({ where: {customer_id: req.currentUser.id } });
        const OTP = Math.floor(Math.random() * 90000) + 10000;

        const data = await CUSTOMERS.update({
            // contact_number: req.currentUser.contact_number,
            otp_for_delivery: OTP
        }, { where: { id: req.currentUser.id } });
        return resp.successResponse(res, "SUCCESS", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

exports.verify_delivery_otp = async (req, res) => {
    try {
        const reqBody = req.body
        const finduser = await CUSTOMERS.findOne({ where: { id: req.currentUser.id } });
        console.log(finduser.otp_for_delivery)
        console.log(reqBody.otp)
        if (req.body.otp == finduser.otp_for_delivery) {
            await CUSTOMERS.update({ otp_for_delivery: 0 }, { where: { id: req.currentUser.id } });
            await CUSTOMERS.update({ is_verify_delivery: 1 }, { where: { id: req.currentUser.id } });

            return resp.successResponse(res, "USER_VERIFIED");
        } else {
            return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
        };
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

/////////////////////////////////////////// SHOW CART ///////////////////////////////////////
exports.showCart = async (req, res) => {
    try {
        const getCart = await CART.findAll({
            attributes: [
                'id',
                'quantity',
                'customer_id',
                'cart_status',
                [db.sequelize.literal('selling_price * cart.quantity'), 'sub_total_price'],
                'createdAt',
                'updatedAt'
            ],
            include: [{ model: PRODUCTS, attributes: ['selling_price', 'product_name', 'id'] }],
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            raw: true
        });

        let discount = 5;
        let tax_and_charges = 20;
        let delivery_charges = 5;
        // if (getCart.cart_status == 1) {
        const sub_total = await CART.findAll({
            attributes: [
                [db.sequelize.literal('sum(product.selling_price * cart.quantity)'), 'sub_total'],
                [db.sequelize.literal(':discount'), 'discount'],
                [db.sequelize.literal(':tax_and_charges'), 'tax_and_charges'],
                [db.sequelize.literal(':delivery_charges'), 'delivery_charges'],
                [db.sequelize.literal('sum(product.selling_price * cart.quantity) - (sum(product.selling_price * cart.quantity) / 100 * :discount) + (:tax_and_charges + :delivery_charges)'), 'total_price']
            ],
            include: [{ model: PRODUCTS, attributes: [] }],
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            raw: true,
            replacements: { discount, tax_and_charges, delivery_charges },
        });
        const showBill = { Cart: getCart, prices: sub_total };
        return resp.successResponse(res, "successfully", showBill);
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

/////////////////////////////////////address/////////////////////////////////////////////////
exports.add_address = async (req, res) => {
    try {
        const reqBody = req.body;
        //  const user_verify = await CUSTOMERS.findOne({ where: { id: req.currentUser.id} })

        // if(user_verify.is_verify_delivery = 0 ){
        //     return resp.failedResponseWithMsg(res,'USER_NOT_VERIFIED')
        // }
        const findUser = await ADDRESS.findOne({ where: { customer_id: req.currentUser.id, address_line1: reqBody.address_line1 } })
        if (findUser) {
            return resp.failedResponseWithMsg(res, "ADDRESS_ALREADY_ADDED")
        }
        const payload = {
            name: reqBody.name,
            customer_id: req.currentUser.id,
            product_id: reqBody.product_id,
            address_line1: reqBody.address_line1,
            address_line2: reqBody.address_line2,
            landmark: reqBody.landmark,
            town_city: reqBody.town_city,
            state: reqBody.state,
            country: reqBody.country,
            pincode: reqBody.pincode,
        }
        const data = await ADDRESS.create(payload)
        return resp.successResponse(res, "SUCCESS", data)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

/////////////////////////////////////products_details////////////////////////////////////////
exports.products_details = async (req, res) => {
    try {
        const reqQuery = req.query;
        const findProduct = await PRODUCTS.findAll({
            where: { sellers_id: reqQuery.sellers_id, product_name: reqQuery.product_name },
            include: [{ model: CATEGORY, attributes: ['id', 'category_name'] }, { model: SUB_CATEGORY, attributes: ['id', 'sub_category_name'] }]
        })
        if (findProduct.length == 0) {
            return resp.failedResponseWithMsg(res, "PRODUCT_NOT_FOUND")
        }
        return resp.successResponse(res, "SUCCESS", findProduct)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

///////////////////////////////checkOut//////////////////////////////////////////////////////
exports.checkout = async (req, res) => {
    try {
        const findUser = await CART.findOne({ where: { customer_id: req.currentUser.id, cart_status: 1 } })
        if (findUser.cart_status == 2) {
            return resp.failedResponse(res, "NO_ITEM_FOUND");
        }
        let discount = 2;
        let tax_and_charges = 20;
        let delivery_charges = 5;
        const sub_total = await CART.findAll({
            attributes: [
                [db.sequelize.literal('sum(product.selling_price * cart.quantity)'), 'sub_total'],
                [db.sequelize.literal(':discount'), 'discount'],
                [db.sequelize.literal(':tax_and_charges'), 'tax_and_charges'],
                [db.sequelize.literal(':delivery_charges'), 'delivery_charges'],
                [db.sequelize.literal('sum(product.selling_price * cart.quantity) - (sum(product.selling_price * cart.quantity) / 100 * :discount) + (:tax_and_charges + :delivery_charges)'), 'total_price']
            ],
            include: [{
                model: PRODUCTS,
                attributes: []
            }],

            raw: true,
            replacements: { discount, tax_and_charges, delivery_charges },
        });
        const showBill = {
            prices: sub_total,
        };
        return resp.successResponse(res, "SUCCESS", showBill);

    } catch (error) {
        return resp.failedResponse(res, error.message)
    }
};

////////////////////////////////////ORDER////////////////////////////////////////////////////
exports.order = async (req, res) => {
    const reqBody = req.body;
    const discount = 5;
    const tax_and_charges = 20;
    const delivery_charges = 15;
    try {
        const cart_items = await CART.findAll({
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            attributes: [
                'id',
                'quantity',
                'customer_id',
                'product_id',
                'cart_status',
                [db.sequelize.literal('selling_price * cart.quantity'), 'sub_total'],
                [db.sequelize.literal('(product.selling_price * cart.quantity) - ((product.selling_price * cart.quantity) / 100 * :discount) + (:tax_and_charges + :delivery_charges)'), 'total_price'],
                // [db.sequelize.literal('product.sellers_id'), 'sellers_id']
            ],
            include: [{ model: PRODUCTS, attributes: ['selling_price', 'id','sellers_id'] }],
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            replacements: { discount, tax_and_charges, delivery_charges },
            raw: true
        });
        console.log(cart_items)
        const display_price = await CART.findAll({
            where: { customer_id: req.currentUser.id, cart_status: 1 },
            attributes: [
                [db.sequelize.literal('sum(product.selling_price * cart.quantity)'), 'sub_total'],
                [db.sequelize.literal(':discount'), 'discount'],
                [db.sequelize.literal(':tax_and_charges'), 'tax_and_charges'],
                [db.sequelize.literal(':delivery_charges'), 'delivery_charges'],
                [db.sequelize.literal('sum(product.selling_price * cart.quantity) - (sum(product.selling_price * cart.quantity) / 100 * :discount) + (:tax_and_charges + :delivery_charges)'), 'total_price']
            ],
            include: [{
                model: PRODUCTS,
                attributes: [],
            }],
            raw: true,
            replacements: { discount, tax_and_charges, delivery_charges },
        });
        if (cart_items.length == 0) return resp.failedResponseWithMsg(res, "CART_IS_EMPTY");
        // const showBill = [cart_items, display_price]
        let order_Cid = generateUniqueCode(6);
        // return
        const bulk_order = await cart_items.map(doc => {
            console.log(doc['product.sellers_id']);
            let { product_id, quantity, customer_id, sub_total, total_price } = doc
            return {
                delevery_type: reqBody.delevery_type,
                payment_type: reqBody.payment_type,
                contact_number: reqBody.contact_number,
                address_id: reqBody.address_id,
                delevery_type: reqBody.delevery_type,
                order_Cid: order_Cid,
                product_id,
                quantity,
                customer_id,
                sub_total,
                discount,
                tax_and_charges,
                delivery_charges,
                total_price,
                sellers_id:doc['product.sellers_id']
            }
        });
        const bulkdata = await ORDER.bulkCreate(bulk_order)
        console.log(bulkdata)
        if (bulk_order.length == 0) return resp.failedResponse(res, "order couldn't place");
        await CART.update({ cart_status: 2 }, { where: { customer_id: req.currentUser.id, cart_status: 1 } });
        return resp.successResponse(res, 'SUCCESS _ORDER_PLACED', [bulkdata,display_price])
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

//////////////////////////////////SHOW ORDER/////////////////////////////////////////////////
exports.show_order = async (req, res) => {
    try {
        const findOrder = await ORDER.findAll({ where: { customer_id: req.currentUser.id } })
        if (!findOrder) {
            return resp.failedResponseWithMsg(res, 'CANNOT_FIND_YOUR_ORDER');
        }
        return resp.successResponse(res, 'SUCCESS', findOrder)
    } catch (error) {
        return resp.failedResponse(res, error.message)
    }

};
//////////////////////////////////////////order STATUS///////////////////////////////////////

exports.cancel_order = async (req, res) => {
    try {
        const findOrder = await ORDER.update({ order_status: req.body.order_status }, { where: { customer_id: req.currentUser.id, order_Cid: req.body.order_Cid, order_status: 1 } })
        if (!findOrder) {
            return resp.failedResponseWithMsg(res, "ORDER_NOTFOUND")
        }
        return resp.successResponse(res, "SUCCES", findOrder);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

/////////////////////////////account status/////////////////////////////////////////////////
exports.account = async (req, res) => {
    try {
        const findUser = await CUSTOMERS.findOne({
            where: { id: req.currentUser.id },
            attributes: ['first_name', 'last_name', 'mobile_number'],
            include: { model: ORDER, attributes: ['id', 'createdAt', 'order_status'] , include:{model:ADDRESS}},
        });
        return resp.successResponse(res, "success", findUser);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    };
};

/////////////////////////////////////SHOW ORDERS LIST SERVICE PROVIDER//////////////////////
exports.service_provider_orderlists = async (req, res) => {
    try {
        const finduser = await ORDER.findAll({
            where: { sellers_id: req.currentUser.id },
            attributes: ['id', 'quantity', 'order_Cid', 'total_price', 'order_status'],
            include: [
                {
                    model: PRODUCTS,
                    attributes: ['id', 'product_name', 'sellers_id'],
                    where: { sellers_id: req.currentUser.id },
                },
                {
                    model: ADDRESS,
                },
            ],
            order: [
                ['createdAt', 'desc']
            ]
        });
        console.log(finduser);
        if (!finduser) { return resp.failedResponseWithMsg(res, 'NOT_FOUND'); };
        return resp.successResponse(res, "SUCCESS", finduser);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

// ////////////////////////////SERVICE PROVIDER RESPONSE ///////////////////////////////////
exports.service_provider_response = async (req, res) => {
    try {
        const finduser = await ORDER.findAll({
            where: { sellers_id: req.currentUser.id, order_Cid: req.query.order_Cid, id: req.query.id },
            attributes: ['id', 'quantity', 'order_Cid', 'total_price', 'order_status', 'delivery_charges', 'sub_total'],
            include: [
                {
                    model: PRODUCTS,
                    attributes: ['id', 'product_name', 'sellers_id'],
                    where: { sellers_id: req.currentUser.id },
                },
                {
                    model: ADDRESS,
                }],
            order: [['createdAt', 'desc']]
        });
        if (!finduser) {
            return resp.failedResponseWithMsg(res, 'NOT_FOUND');
        };
      const response =  await ORDER.update({ order_status: req.query.order_status }, { where: { sellers_id: req.currentUser.id, order_status: "1" } });
        return resp.successResponse(res, "SUCCESS", [response,finduser]);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};