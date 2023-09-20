const db = require('../models/index');
const SERVICEPROVIDER = db.service_provide;
const CUSTOMER = db.customers;
const resp = require("../helper/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const response = require('../helper/response');

//////////////////////////////////////////signUp///////////////////////////////////////////////
exports.signUp = [
    body('mobile_number').isMobilePhone().notEmpty().withMessage("mobile number is valid"),
    body('password').isStrongPassword().notEmpty().withMessage("please_enter_a_strong_password"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.failedResponseWithMsg(res, errors.array())
            }

            const reqBody = req.body;
            ///////////////////////////////////service provider/////////////////////////////////////////

            if (reqBody.userType == '0') {
                const findUser = await SERVICEPROVIDER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                if (findUser) {
                    return resp.failedResponseWithMsg(res, "OLD_USER_TRY_LOGIN_IN");
                };
                const hasspass = await bcrypt.hash(reqBody.password, 10);
                let genrateOtp = Math.floor(Math.random() * 90000) + 10000;
                const data = {

                    country_code: reqBody.country_code,
                    mobile_number: reqBody.mobile_number,
                    password: hasspass,
                    otp: genrateOtp
                };
                const addUser = await SERVICEPROVIDER.create(data);
                return resp.successResponse(res, "SIGNUP_Successfull", addUser);
            }

            //////////////////////////////////customer/////////////////////////////////////////////////

            else if (reqBody.userType == '1') {
                const findUser = await CUSTOMER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                if (findUser) {
                    return resp.failedResponseWithMsg(res, "OLD_USER_TRY_LOGIN_IN");
                };
                const hassedpassword = await bcrypt.hash(reqBody.password, 10);
                let genrateOtp = Math.floor(Math.random() * 90000) + 10000;

                const data = {
                    country_code: reqBody.country_code,
                    mobile_number: reqBody.mobile_number,
                    password: hassedpassword,
                    otp: genrateOtp
                };
                const addUser = await CUSTOMER.create(data);
                return resp.successResponse(res, "SIGNUP_Successfull", addUser);
            }
        } catch (error) {
            return resp.failedResponse(res, error.message);
        };
    }];

/////////////////////////////////////////////verification/////////////////////////////////////
exports.verification = [
    body('mobile_number').notEmpty().isMobilePhone().withMessage("mobile number is valid"),
    async (req, res) => {
        try {
            const reqBody = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return resp.failedResponseWithMsg(res, errors.array())
            }

            ///////////////////////////////////service provider/////////////////////////////////////////

            if (reqBody.userType == 0 && reqBody.stage == 1) {
                const finduser = await SERVICEPROVIDER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                if(!finduser){
                    return resp.failedResponseWithMsg(res,"USER_NOT_FOUND")
                }   
                else if (reqBody.otp == finduser.otp) {
                    await SERVICEPROVIDER.update({ otp: null }, { where: { mobile_number: req.body.mobile_number } });
                    return resp.successResponse(res, "USER_VERIFIED");
                } else {
                    return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
                };
            };
            //////////////////////////////////customer/////////////////////////////////////////////////

            if (reqBody.userType == 0 && reqBody.stage == 2) {
                return resp.failedResponseWithMsg(res, 'invalid_entry')
            }

            /////////////////////////////////otp verify///////////////////////////////////

            else if (reqBody.userType == "1" && reqBody.stage == "1") {
                const finduser = await CUSTOMER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                if(!reqBody.otp){
                return resp.failedResponseWithMsg(res,"INVALID_OTP")
                }
              else  if (!finduser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                }
               else if (reqBody.otp == finduser.otp) {
                    await CUSTOMER.update({ otp: null, is_verify: 1 }, { where: { id: finduser.id } });
                    const token = jwt.sign({ id: finduser.id }, process.env.key);
                    return resp.successResponse(res, "USER_VERIFIED",token);
                }
                else if (reqBody.otp != finduser.otp) { return resp.failedResponseWithMsg(res, 'incorrect_otp') }
            }

                ////////////////////////////// After otp details/////////////////////////////


                else if (reqBody.userType == 1 && reqBody.stage == 2) {
                    const finduser = await CUSTOMER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                    if (finduser.is_verify == 0) {
                        return resp.failedResponse(res, "USER_NOT_VERIFIED");
                    }
                    const payload = {
                        first_name: reqBody.first_name,
                        last_name: reqBody.last_name,
                        dob: reqBody.dob,
                        gender: reqBody.gender,
                        email: reqBody.email,
                        profile_picture: req.file.filename,
                    };
                    const data = await CUSTOMER.update(payload, { where: { id: finduser.id } });
                    // console.log(data);
                    return resp.successResponse(res, "USER_VERIFIED",data);
                };
        } catch (error) {
            return resp.failedResponse(res, error.message);
        };
    }];

///////////////////////////////////////////forgot_password////////////////////////////////////
exports.forgot_password = [
    body('mobile_number').isMobilePhone().notEmpty().withMessage('ENTER_A_VALID_PHONENUMBER'),
    async (req, res) => {
        const reqBody = req.body;
        try {
            if (reqBody.userType == 0) {
                const findUser = await SERVICEPROVIDER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                };
                if (!reqBody.otp) {
                    let genrateOtp = Math.floor(Math.random() * 90000) + 10000;
                    await SERVICEPROVIDER.update({ otp: genrateOtp }, { where: { id: findUser.id } });
                    return resp.successResponse(res, "OTP_SENT");
                }
                else if (reqBody.otp) {
                    if (reqBody.otp == findUser.otp) {
                        const newPassword = reqBody.newPassword;
                        const hasspass = await bcrypt.hash(newPassword, 10);
                        await SERVICEPROVIDER.update({ password: hasspass }, { where: { id: findUser.id } });
                        await SERVICEPROVIDER.update({ otp: null }, { where: { mobile_number: req.body.mobile_number } });
                        return resp.successResponse(res, "PASSWORD_REST_SUCCESSFULLY");
                    } else {
                        return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
                    };
                }
            }
          else if (reqBody.userType == 1) {
                const findUser = await CUSTOMER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                if (!findUser) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                };
                if (!reqBody.otp) {
                    let genrateOtp = Math.floor(Math.random() * 90000) + 10000;
                    await CUSTOMER.update({ otp: genrateOtp }, { where: { id: findUser.id } });
                    return resp.successResponse(res, "OTP_SENT");
                }
                else if (reqBody.otp) {
                    if (reqBody.otp == findUser.otp) {
                        const newPassword = reqBody.newPassword;
                        const hasspass = await bcrypt.hash(newPassword, 10);
                        await CUSTOMER.update({ password: hasspass }, { where: { id: findUser.id } });
                        await CUSTOMER.update({ otp: null }, { where: { mobile_number: req.body.mobile_number } });
                        return resp.successResponse(res, "PASSWORD_REST_SUCCESSFULLY");
                    } else {
                        return resp.failedResponseWithMsg(res, "INCORRECT_OTP");
                    };
                }
            };
        
        } catch (error) {
            return resp.failedResponseWithMsg(res, error.message);
        };
    }];

////////////////////////////////////////////login////////////////////////////////////////////
exports.login = [
    body('mobile_number').isMobilePhone().notEmpty().withMessage('ENTER_A_VALID_PHONENUMBER'),
    async (req, res) => {
        try {
            const reqBody = req.body
            const { userType } = req.body;

            ///////////////////////////////////service provider/////////////////////////////////////////

            if (userType == 0) {
                const findUser = await SERVICEPROVIDER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                if (findUser == null) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                };
                if (!reqBody.password) {
                    return resp.failedResponseWithMsg(res, "ENTER_PASSWORD");
                };
                const verifypassword = await SERVICEPROVIDER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                const hassedPassword = await bcrypt.compare(reqBody.password, verifypassword.password);
                // if (hassedPassword) {
                //     // return resp.failedResponseWithMsg(res, "LOGIN SUCCESSFUL");
                // } else 
                if (!hassedPassword) {
                    return resp.failedResponseWithMsg(res, "INCORRECT_PASSWORD");
                };
                const token = jwt.sign({ id: findUser.id }, process.env.key);
                return resp.successResponseWithToken(res, "LOGIN_SUCCESSFUL", token);
            }


            //////////////////////////////////customer/////////////////////////////////////////////////

            else if (userType == 1) {
                const findUser = await CUSTOMER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                if (findUser == null) {
                    return resp.failedResponseWithMsg(res, "USER_NOT_FOUND");
                };
                if (!reqBody.password) {
                    return resp.failedResponseWithMsg(res, "ENTER_PASSWORD");
                };
                const verifypassword = await CUSTOMER.findOne({ where: { mobile_number: reqBody.mobile_number } });
                const hassedPassword = await bcrypt.compare(reqBody.password, verifypassword.password);
                // if (hassedPassword) {
                //     // return resp.failedResponseWithMsg(res, "LOGIN SUCCESSFUL");
                // } else 
                if (!hassedPassword) {
                    return resp.failedResponseWithMsg(res, "INCORRECT_PASSWORD");
                };
                const token = jwt.sign({ id: findUser.id }, process.env.key);
                return resp.successResponseWithToken(res, "LOGIN_SUCCESSFUL", token);
            }
        } catch (error) {
            return resp.failedResponse(res, error.message);
        }
    }];

//////////////////////////////////////////GET TOKKEN//////////////////////////////////////////
exports.get_token = async (req, res) => {
    try {
        return resp.successResponse(res, "SUCCESS", req.currentUser);
    } catch (err) {
        return resp.failedResponse(res, err.message);
    }
};
