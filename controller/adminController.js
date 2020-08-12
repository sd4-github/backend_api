const ProductModel = require('../model/product');
const mongodb=require('mongodb');
const ObjectId = mongodb.ObjectId;
const cloudinary = require('cloudinary');
const product = require('../model/product');


//add product
exports.addProd = async (req, res, next) => {
    const pname = req.body.pname;
    const pvalue = req.body.pvalue;
    const pdesc = req.body.pdesc;
    const pimage = req.file.path;

    if(!pname){
        return res.status(401)
        .json({
            success:false,
            message:"productname is required!"    
        })
    }
    if (!pvalue){
        return res.status(401)
        .json({
            success:false,
            message:"product value is required!"    
        })
    }
    if (!pdesc){
        return res.status(401)
        .json({
            success:false,
            message:"product desc is required!"    
        })
    }
    if (!pimage){
        return res.status(401)
        .json({
            success:false,
            message:"product image is required!"    
        })
    }
    else{
        
        const imageUpload = await cloudinary.v2.uploader.upload(pimage); 
        console.log('result:', imageUpload);
        
        const Product = new ProductModel({ pname: pname, pvalue: pvalue, pdesc: pdesc, pimage: imageUpload.secure_url });
        console.log(pimage);
        const saveData= await Product.save();
        if (saveData && imageUpload) {
            return res.status(200)
            .json({
                success:true,
                message:"product is added!"
            })
        }
        else{
            return res.status(401)
                .json({
                    success: false,
                    message: "not added!"
                })
        }
    }
}

exports.getProd = async (req, res, next) => {
    
    const findResult = await ProductModel.find()           //find predefined function which is used to collect all data
 
    try {
        res.status(200).json({
            success: true,
            message: "products fetched",
            data:findResult
        })
    } 
    catch (error) {
        res.status(400).json({
            success: false,
            message: "product fecth failed"
        })
    } 

}

exports.editProd = async (req,res,next) => {
    const _id=req.params._id;
    ProductModel.findById(_id).then(editProduct => {            //findById is predefind mongoose function
        if (!editProduct) {
            {
                res.status(400).json({
                    success: false,
                    message: 'product name field is required '
                })
            }
        }
        else {
            res.status(201).json({
                success: true,
                message: 'product is displayed successfully',
                product_data: editProduct
            })
        }
    }).catch(err => {
        res.status(400).json({
            success: false,
            message: 'internal server error'
        })
    })

}


exports.updateProd = async (req, res, next) => {
    const pimage = req.file.path;
    const imageUpload = await cloudinary.v2.uploader.upload(pimage);
    console.log('result:', imageUpload);
    const id = req.params._id;
    const updates = {
        pname: req.body.pname,
        pvalue: req.body.pvalue,
        pdesc: req.body.pdesc,
        pimage: imageUpload.secure_url
    };
    const options = { new: true };
    const updatedData = await ProductModel.findByIdAndUpdate(id,updates,options);
    console.log(updatedData);
    try {
        return res.status(200).json({
                    success: true,
                    message: "product succesfully updated",
                    data: updatedData
     })
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: "update unsuccessfull!",
            err:error.message
        })
    }
}

exports.deleteProd= async (req,res,next)=>{
    const _id = req.params._id;
    const deleteResult= await ProductModel.deleteOne({ _id:_id})
        try {
            res.status(201).json({
                success:true,
                message:"product succesfully deleted"
            })
        }
        catch(err) {
            res.status(400).json({
                success: false,
                message: "delete unsuccessfull!"
            })
        }

}