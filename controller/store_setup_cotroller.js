const db = require('../models/index');
const SETUPSTORE = db.store_setup;
const resp = require("../helper/response");

////////////////////////////////store_setup//////////////////////////////////////////////////
exports.store_setup = async (req, res) => {
    try {
        const reqBody = req.body;
        const finduser = await SETUPSTORE.findOne({
            where: { business_name: reqBody.business_name, mobile_number: reqBody.mobile_number }
        })
        if(finduser){
            return resp.failedResponseWithMsg(res,'ALREADY_EXISTS')
        }
        const playload = {
            sellers_id: req.currentUser.id,
            image: req.file.filename,
            business_name: reqBody.business_name,
            business_type: reqBody.business_type,
            descripition: reqBody.descripition,
            country_code: reqBody.country_code,
            mobile_number: reqBody.mobile_number,
            whatsapp_support: reqBody.whatsapp_support,
            business_email: reqBody.business_email,
            store_address: reqBody.store_address,
            city: reqBody.city,
            state: reqBody.state,
            country: reqBody.country,
            zip_code: reqBody.zip_code
        }

        // console.log("==========", playload);
        const data = await SETUPSTORE.create(playload);
        return resp.successResponse(res, "success", data);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }

};

//////////////////////////////account_info//////////////////////////////////////////////////
exports.account_info = async (req, res) => {
    try {
        const reqQuery = req.query;
        const findUser = await SETUPSTORE.findOne({
            where: { sellers_id: req.currentUser.id },
            attributes: ['id', 'image', 'business_name', 'business_type', 'country', 'store_address', 'descripition', 'mobile_number', 'whatsapp_support']
        })
        if (!findUser) {
            return resp.failedResponseWithMsg(res, "NOT_FOUND");
        };
        return resp.successResponse(res, "SUCCESS", findUser);
    } catch (error) {
        return resp.failedResponse(res, error.message);
    }
};

