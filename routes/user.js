const express = require("express");
const router = express.Router();
const User = require("../MODELS/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {SaveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup",userController.signup)

router.post("/signup",wrapAsync( userController.postSignup));

router.get("/login",userController.login);

router.post("/login",SaveRedirectUrl, 
    passport.authenticate('local',
        {failureRedirect: "/login",
         failureFlash: true }), userController.loginSubmit)

router.get("/logout",userController.logout)

module.exports = router;