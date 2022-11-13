import express from "express";
import path from "path";
import { engine } from 'express-handlebars';
import cors from "cors";
import userRoutes from "./routes/users.routes";
import alimentosCRUD from "./routes/alimentosCRUD.routes"
import adminRoutes from "./routes/admin.routes"
import morgan from "morgan";
import moment from 'moment';
import methodOverride from "method-override";
import session from "express-session";
import flash from "connect-flash"
import passport from "passport";
import config from "./config";
import Handlebars from 'handlebars'
import multer from "multer";
import {nodemailer,transporter,sendMail} from "./mailConfig"


const fs = require('fs')

//MAIL
//const nodemailer = require('nodemailer');

const app = express();
import('./config/passport');

//MAIL




/*transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

    console.log('Message sent: ' + info.response);
});*/


//Satich paths
app.use(express.static(__dirname + '/public/css'));


// settings
app.set('port', config.port);
app.set('views', path.join(__dirname,'views'));
app.engine(".hbs", engine({
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


 

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
  }); 
  

const storage =
    multer.diskStorage({
        filename: function (req,file,cb) {
            cb(null, file.originalname); 
        },
        
    destination: path.join(__dirname,'public/uploads')
});


app.use(multer({
    storage,
    dest: path.join(__dirname,'public/uploads')
}).single('image'));

// Routes
app.use(userRoutes);
app.use(alimentosCRUD);
app.use(adminRoutes);


//Helpers
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    if (arg1 === arg2) {
        return options.fn(this)
    } else {
        return options.inverse(this)
    }
})

Handlebars.registerHelper('formatTime', function (date, format) {
    var mmnt = moment(date);
    return mmnt.format(format);
});

export default app;
