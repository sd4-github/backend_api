const mongoose=require('mongoose');

const Schema=mongoose.Schema; //Schema is a class of mongoose
const ProductSchema=new Schema({
    pname:{
        type:String,
        required:true
    },
    pvalue: {
        type: Number,
        required: true
    },
    pdesc:{
        type: String,
        required: true
    },
    
    pimage:{
        type: String,
        required: false
    }

});

module.exports=mongoose.model('Product',ProductSchema);