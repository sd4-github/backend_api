const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const OrderSchema=new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobilenum:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    total:{
        type: Number,
        required: true
    },
    orderproduct: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('OrderModel', OrderSchema);