const ProductModel = require('../model/product');
const mongodb=require('mongodb');
const ObjectID = mongodb.ObjectID;



//add product
exports.addProd = async (req, res, next) => {
    const pname = req.body.pname;
    const pvalue = req.body.pvalue;
    const pdesc = req.body.pdesc;
    const pimage = req.file;
    const imagePath = pimage.path;

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
    if (!imagePath){
        return res.status(401)
        .json({
            success:false,
            message:"product image is required!"    
        })
    }
    else{
        const Product = new ProductModel({ pname: pname, pvalue: pvalue, pdesc: pdesc, pimage: imagePath });
        console.log(pimage);
        const saveData= await Product.save();
        if (saveData) {
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
    const editResult = await ProductModel.findById(_id)          //predefined mongoose function
    try {
        res.status(201).json({
            success: true,
            message: "product succesfully edited",
            data: editResult
        })
    }
    catch(err){
        res.status(400).json({
            success: false,
            message: "edit unsuccessfull!"
        })   
    }
    
}

exports.updateProd = async (req, res, next) => {
    const _id = req.body._id;
    const pname = req.body.pname;
    const pvalue = req.body.pvalue;
    const pdesc = req.body.pdesc;
    const imagePath = req.file.path;

    const updateResult = await ProductModel.findById(_id)
        try{
            updateResult.pname=pname;
            updateResult.pvalue=pvalue;
            updateResult.pdesc=pdesc;
            
            if (imagePath) {
                updateResult.pimage = imagePath;
            }

            const updatedData = await updateResult.save()
            try{
                res.status(200).json({
                    success: true,
                    message: "product succesfully updated",
                    data: updatedData
                })
            }
            catch (err) {
                res.status(400).json({
                    success: false,
                    message: "update unsuccessfull!"
                })
            }        
        }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "update unsuccessfull!"
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
    







