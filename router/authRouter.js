const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const {check,body}=require('express-validator');


router.post('/register', 
    [body('firstname','firstname is required').isLength({min:5}),
    body('lastname','lastname is required').isLength({min:5}),
    check('email').isEmail().withMessage("invalid email format"),
    body('password', "enter valid password!")], authController.register);
router.post('/login', [check('email').isEmail().withMessage("invalid email format"), 
                    body('password',"enter valid password!")], authController.login);
router.get('/logout', authController.logout);

router.post('/req-reset-password', authController.ResetPassword);
router.post('/valid-password-token', authController.ValidPasswordToken);
router.post('/new-password', authController.NewPassword);



module.exports = router;