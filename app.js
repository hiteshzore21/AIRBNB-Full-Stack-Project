
require('dotenv').config(); 
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require('./MODELS/listing');
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./MODELS/user.js");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

// const mongoUrl = "mongodb://127.0.0.1:27017/airbnb";


const DbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(DbUrl);
}

main().then(()=>{
    console.log("DB Connected");
}).catch(err=>{
    console.log(err);
}) 


const store = MongoStore.create({
    mongoUrl: DbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
})

store.on("error",(err)=>{
    console.log("Error in Mongo Session Store -",err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
    
}



app.use(session(sessionOptions));
app.use(flash())


app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
    res.locals.success = req.flash("success"); 
    res.locals.error = req.flash("error"); 
    res.locals.currentUser = req.user;
    next();    
})

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get('/',(req,res)=>{
//     res.send("Hi i'm root");
// })


app.get("/demoUser",async(req,res)=>{
    let fakeUser = new User({
        email: "hiteshzore@gmail.com",
        username: "delta_student"
    })

  let registerUser =  await User.register(fakeUser,"helloworld");
    res.send(registerUser);
})


app.all("*splat",(req,res,next)=>{
   next( new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went Wrong"} = err;
    res.render("error",{err});
})

app.listen(port,()=>{
    console.log("Listening on Port",port);
}) 