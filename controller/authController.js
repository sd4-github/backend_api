const authModel = require('../model/authModel');
const passwordResetToken = require('../model/resetToken');
const mongodb = require('mongodb');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
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

                return transport.sendMail({
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
                    message: "register unsuccessfull!"
                })
            }
        }
    }
    catch (err) {
        // console.log(err);
        res.status(400).json({
            success: false,
            message: "register unsuccessfull!"
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
                            usertype: req.session.userData.usertype
                        }
                        res.cookie('cookieData', cookieData);
                        console.log('logged in Successfully!');

                        const token = jwt.sign({ email: loginResult.email}, "SECRETPASS", { expiresIn: "1h"})
                        res.status(200).json({
                            success: true,
                            message: "logged in Successfully!",
                            email: cookieData.email,
                            usertype: cookieData.usertype,
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


exports.ResetPassword = async (req, res) => {
    if (!req.body.email) {
        return res
            .status(500)
            .json({ message: 'Email is required' });
    }
    const user = await authModel.findOne({
        email: req.body.email
    });
    if (!user) {
        return res
            .status(409)
            .json({ message: 'Email does not exist' });
    }
    const resettoken = new passwordResetToken({ user_id: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
    resettoken.save(err => {
        if (err) { 
            return res.status(500)({ msg: err.message });
        }
        console.log(resettoken);
        passwordResetToken.find({ user_id: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
        res.status(200).json({ message: 'Reset Password successfully.', data: resettoken});
        // var transporter = nodemailer.createTransport({
        //     service: 'Gmail',
        //     port: 465,
        //     auth: {
        //         user: 'user',
        //         pass: 'password'
        //     }
        // });
        // var mailOptions = {
        //     to: user.email,
        //     from: 'your email',
        //     subject: 'Node.js Password Reset',
        //     text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        //         'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        //         'http://localhost:4200/response-reset-password/' + resettoken.resettoken + '\n\n' +
        //         'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        // }
        // transporter.sendMail(mailOptions, (err, info) => {
        // })
    })
}


exports.ValidPasswordToken = async (req, res)=> {
    if (!req.body.resettoken) {
        return res
            .status(500)
            .json({ message: 'Token is required' });
    }
    const user = await passwordResetToken.findOne({
        resettoken: req.body.resettoken
    });
    if (!user) {
        return res
            .status(409)
            .json({ message: 'Invalid URL' });
    }
    authModel.findOneAndUpdate({ _id: user.user_id }).then(() => {
        res.status(200).json({ message: 'Token verified successfully.' });
    }).catch((err) => {
        return res.status(500).send({ msg: err.message });
    });
}

 exports.NewPassword= async (req, res) => {
        passwordResetToken.findOne({ resettoken: req.body.resettoken }, (err, userToken, next) => {
            if (!userToken) {
                return res
                    .status(409)
                    .json({ message: 'Token has expired', err: err });
            }
        
        authModel.findOne({ _id: userToken.user_id }, (err, userDetails, next) => {
                if (!userDetails) {
                    return res
                        .status(409)
                        .json({ message: 'User does not exist', err: err });
                }
                return bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res
                            .status(400)
                            .json({ message: 'Error hashing password', err: err } );
                    }
                        console.log('userPass:', userDetails.password);
                        console.log('hashpass:', hash);
                        userDetails.password=hash;
                        console.log('updated userDetails:', userDetails.password);
                    authModel.findOneAndUpdate({_id:userToken.user_id}, {password:userDetails.password}, (err, findResult) => {
                        if (err) {
                            return res
                                .status(400)
                                .json({ message: 'Password can not reset.',err:err });
                        } else {        
                            userToken.remove();   
                            console.log('oldPass', findResult.password);                        
                            console.log('newPass', userDetails.password);                        
                            return res
                                .status(201)
                                .json({ message: 'Password reset successfully', newPass: userDetails.password});
                        }

                    });
                });
            });

        })
    }


    

    