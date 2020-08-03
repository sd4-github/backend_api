const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/isAuth');



router.get('/showprod', userController.showProd);
router.get('/searchprod', userController.searchProd);
router.get('/detailsprod/:_id',userController.detailsProd);
router.get('/addtocart', userController.showCart);
router.post('/addtocart',auth,userController.addToCart);
router.post('/updatecart',userController.updateCart);
router.get('/deletecartprod/:p_id', userController.deleteCartProd);
router.get('/getcheckout',userController.getCheckout);
router.post('/postcheckout',userController.postCheckout);
router.get('/order',userController.order);




module.exports=router;