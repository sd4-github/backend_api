const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/isAuth');



router.get('/showprod', userController.showProd);
router.get('/searchprod', userController.searchProd);
router.get('/detailsprod/:_id',userController.detailsProd);
router.get('/showcart/:user_id', userController.showCart);
router.post('/addtocart',userController.addToCart);
router.post('/updatecart',userController.updateCart);
router.get('/deletecartprod/:p_id', userController.deleteCartProd);
router.get('/getcheckout/:user_id',userController.getCheckout);
router.post('/postcheckout',userController.postCheckout);
router.get('/order/:user_id',userController.order);




module.exports=router;
