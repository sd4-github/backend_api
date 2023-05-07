const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
let db;
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env);
let dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tm4btmo.mongodb.net/?retryWrites=true&w=majority`;

const mongoConnect= (callback)=>{
    MongoClient.connect(dbUrl, { useUnifiedTopology: true }, { useNewUrlparser: true }).then(result=>{
        db = result.db("sd4_mongo");
        console.log('connected!');
        callback();
    }).catch(err=>{
        console.log('not connected!');
    })
}

const getdb=()=>{
    if (db) {
        return db;
    }
    else{
        throw "no database found";
    }
}

exports.mongoConnect=mongoConnect;
exports.getdb=getdb;
