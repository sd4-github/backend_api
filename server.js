const PORT = process.env.PORT || 3200;
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const bodyParser = require('body-parser');

const adminRouter = require('./router/adminRouter');
const userRouter = require('./router/userRouter');
const authRouter = require('./router/authRouter');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();
let dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.tm4btmo.mongodb.net/?retryWrites=true&w=majority`;
const session = require('express-session');
const cookie = require('cookie-parser');
const mongodb_session = require('connect-mongodb-session')(session);
const authModel = require('./model/authModel');
const cors = require('cors');
const corsOptions ={
    origin: ['http://localhost:3200', 'https://mycart-backend.onrender.com', 'https://jittery-boa-tweed-jacket.cyclic.app'], 
    credentials:true,
    optionSuccessStatus:200
}


app.use(express.static(path.join(__dirname,'public')))
app.use('/image', express.static(path.join(__dirname, 'image')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

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


app.use(adminRouter);
app.use(userRouter);
app.use(authRouter);
app.use(cors(corsOptions));


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