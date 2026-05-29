const User = require("../MODELS/user.js"); 

module.exports.signup = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postSignup = async(req,res,next)=>{
    try{
        let {username, email, password} = req.body;
    let newUser = new User({username, email, password});
    let registerUser = await User.register(newUser,password);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        } 
    console.log(registerUser);
    req.flash("success","Welcome to Airbnb");
    res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.login = (req,res)=>{
    res.render("users/login");
}

module.exports.loginSubmit = async(req,res)=>{
   req.flash("success","Welcome Back to Airbnb");
   let redirectUrl = res.locals.redirectUrl || "/listings"
   res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           next(err);
        }
    req.flash("success","You Logged Out!");
    res.redirect("/listings");
    });
}