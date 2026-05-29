const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

const seesionOptions = {
  secret: "mysecretcode",
     resave: false,
     saveUninitialized: true
}

app.use(session(seesionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully");   
    res.redirect("/hello")
})

app.get("/hello",(req,res)=>{
    res.send(`hello, ${req.session.name}`);
})


// app.get("/giveCount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//        req.session.count = 1;
//     }
//     console.log(req.session.count);
//     res.send(`You sent the req for${req.session.count} times`);
// });


app.get("/request",(req,res)=>{
    res.send("U sent a req");
})

app.listen(3000,()=>{
    console.log("Servelign on port 3000");
})