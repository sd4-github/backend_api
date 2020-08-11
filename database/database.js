const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
let db;
let dbUrl = "mongodb+srv://sd4_mongo:maximum21@cluster0-bz0me.mongodb.net/sd4_mongo?retryWrites=true&w=majority";

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
