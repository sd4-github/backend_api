const authModel = require('../model/authModel');
const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');
const nodemailer=require('nodemailer');
const sendgrid=require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator/check');
const jwt = require('jsonwebtoken');


const transport = nodemailer.createTransport(sendgrid({
    auth:{
        api_key: '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'

    }
}))



exports.register = async (req, res, next) => {
    const fname = req.body.firstname;
    const lname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;


    let error = validationResult(req);
    if (!error.isEmpty()) {
        let vError = validationResult(req).array();
        console.log(vError);  //msg is a key of vError object,so u.msg is written in ejs file
    }


    const emailExists = await authModel.findOne({ email: email })
    try {

        if (emailExists) {
             console.log('email already exists!');
            
            res.status(400).json({
                success: false,
                message: "email already exists!"
            })        
        }
        else {
            const hashPass = await bcrypt.hash(password, 12);
            try {
                const userDetails = new authModel({ firstname: fname, lastname: lname, email: email, password: hashPass, usertype: 'user' });
                const saveResult = await userDetails.save();

                console.log(saveResult);
                res.status(200).json({
                    success: true,
                    message: "new user created!",
                    data: saveResult
                })

                return await transport.sendMail({
                    to: email,
                    from: 'soumikd4@gmail.com',
                    subject: 'confirmation mail',
                    html: `hi ${fname} ${lname}, your email is confirmed!`
                })


            }
            catch (err) {
                // console.log(err)
                res.status(400).json({
                    success: false,
                    message: "email already exists!"
                })
            }
        }
    }
    catch (err) {
        // console.log(err);
        res.status(400).json({
            success: false,
            message: "email already exists!"
        })
    }

}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const checkbox = req.body.checkbox;

    const loginResult = await authModel.findOne({ email: email });
    try {
        if (!loginResult) {
            console.log(loginResult);
            res.status(400).json({
                success: false,
                message: "invalid credential!",
                data: loginResult
            })
        }
        const data = await bcrypt.compare(password, loginResult.password);
        try {
            if (data) {
                req.session.isLoggedin = true;  //here we have created session variable within that we have to store loggedin , userdata
                console.log(req.session.isLoggedin);
                req.session.userData = loginResult;
                console.log(req.session.userData);

                return req.session.save(err => {     

                    if (checkbox) {
                        const cookieData = {
                            email: loginResult.email,
                            password: password, //if result.password written then bcrypted password will sent, check result value in console

                        }
                        res.cookie('cookieData', cookieData);
                        console.log('logged in Successfully!');

                        const token = jwt.sign({ email: loginResult.email}, "SECRETPASS", { expiresIn: "1h"})
                        res.status(200).json({
                            success: true,
                            message: "logged in Successfully!",
                            data: cookieData,
                            jwt: token
                        })
                    }
                    else {
                        res.status(200).json({
                            success: true,
                            message: "logged in Successfully!"
                        })
                    }
                })

            } else {
                res.status(400).json({
                    success: false,
                    message: "something went wrong!"
                })            
            }
        }
        catch (err) {
            console.log(err);
            res.status(400).json({
                success: false,
                message: "something went wrong!"
            })

        }
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: "something went wrong!"
        })
    }
}

exports.logout = (req,res,next) => {
    req.session.destroy(()=>{
        console.log('logged out successfully!');
        res.status(200).json({
            success: true,
            message: "logged out successfully!"
        })   
     })
}