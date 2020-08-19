const express=require('express');
const adminRouter=express.Router();
const adminController=require('../controller/adminController');
const jwtAuth = require('../middleware/isAuth');


adminRouter.post('/addprod',jwtAuth, adminController.addProd);
adminRouter.get('/getprod',adminController.getProd);
adminRouter.get('/editprod/:_id', adminController.editProd);
adminRouter.patch('/updateprod/:_id',adminController.updateProd);
adminRouter.get('/deleteprod/:_id',adminController.deleteProd);
adminRouter.get('/deleteuser/:_id',adminController.deleteUser);



module.exports=adminRouter;
