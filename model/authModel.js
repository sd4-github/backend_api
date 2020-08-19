const mongoose = require('mongoose');

const Schema = mongoose.Schema; //Schema is a class of mongoose
const AuthSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    }

},
  { timestamps: true }
);

module.exports = mongoose.model('authModel', AuthSchema);
