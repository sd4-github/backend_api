const express=require('express');
const router=express.Router();
const homeController=require('../controller/homeController');
const jwtAuth = require('../middleware/isAuth');




router.post('/addprod',jwtAuth, homeController.addProd);
router.get('/getprod',homeController.getProd);
router.get('/editprod/:_id', homeController.editProd);
router.post('/updateprod',homeController.updateProd);
router.get('/deleteprod/:_id',homeController.deleteProd);



module.exports=router;