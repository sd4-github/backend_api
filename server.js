const PORT = process.env.PORT || 3200;
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer'); //Multer is a node.js middleware for handling multipart/formdata,which is primarily used for uploading files.
const cloudinary = require('cloudinary').v2;

const bodyParser = require('body-parser');

const adminRouter = require('./router/adminRouter');
const userRouter = require('./router/userRouter');
const authRouter = require('./router/authRouter');
const mongoose = require('mongoose');
let dbUrl = "mongodb+srv://sd4_mongo:maximum21@cluster0-bz0me.mongodb.net/sd4_mongo?retryWrites=true&w=majority";
const session = require('express-session');
const cookie = require('cookie-parser');
const mongodb_session = require('connect-mongodb-session')(session);
const authModel = require('./model/authModel');
const cors = require('cors'); //cross origine resource sharing is a mechanism that uses additional http headers to tell browsers to give a webapplication running at one
//origin, access to selected resourses from a different origin



// const { userInfo } = require('os');

// const csrfProtect=csrf();

// app.set('view engine','ejs');//initialize ejs
// app.set('views','views');//initialize in views folder
// app.use(express.static(path.join(__dirname,'public'))) //public folder statically served
app.use('/image', express.static(path.join(__dirname, 'image')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    next();
})


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes('png') || file.mimetype.includes('jpg') || file.mimetype.includes('jpeg')) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

cloudinary.config({
    cloud_name: 'sd4-cloudinary',
    api_key: '325421615568981',
    api_secret: 'VFQjx6zuW7x9LRcDqkR0g42A-cI'
})

const sessionStore = mongodb_session({
    uri: dbUrl,
    collection: 'my_session'
})

app.use(session({ secret: 'my_secret', resave: false, saveUninitialized: false, store: sessionStore }));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter, limits: { fieldSize: 1024 * 1024 * 5 } }).single('pimage')); //image size limit 5mb converted to kb

app.use(cookie());
// app.use(csrfProtect);
// app.use(connect_flash());

app.use((req, res, next) => {
    if (!req.session.userData) {
        return next();
    }
    authModel.findById(req.session.userData._id)
        .then(userValue => {
            req.userInfo = userValue;
            console.log(req.userInfo);
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

// app.use((req,res,next)=>{
//     res.locals.isAuthenticated=req.session.isLoggedin;
//     res.locals.csrfToken=req.csrfToken();
//     next();
// })

app.use(adminRouter);
app.use(userRouter);
app.use(authRouter);
app.use(cors());


// mongoose.connect(dbUrl,{useNewUrlParser:true})
//     .then(result=>{
//         app.listen(3000, () => {
//             console.log('server is running');
//         })
//     })
//     .catch(
//         err => {
//             console.log('not connected');
//         })

const connection = (async () => {
    try {
        const connected = await mongoose.connect(dbUrl, { useNewUrlParser: true });

        if (connected) {
            app.listen(PORT, () => {
                console.log("server is running on PORT:", PORT);
            })
        }
    } catch (err) {
        console.log('error: ' + err)
    }
})();