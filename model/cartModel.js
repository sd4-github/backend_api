const mongoose = require('mongoose');

const Schema = mongoose.Schema; //Schema is a class of mongoose
const CartSchema = new Schema({
    
    user_id: {
        type: String,
        required: true
    }, 
    p_id: {
        type: String,
        required: true
    }, 
    quantity: {
        type: Number,
        required: true
    },
    
    pname: {
        type: String,
        required: true
    },
    pvalue: {
        type: Number,
        required: true
    },
    pimage: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('CartModel', CartSchema);