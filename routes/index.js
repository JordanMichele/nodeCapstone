const express  = require("express");
const router   = express.Router();
const passport = require("passport");
const User     = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res){
  res.render("landing");
});
//===================
// AUTH ROUTES
//===================

//Show Register Form
router.get("/register", function(req, res){
  res.render("register", {page: 'register'});
});

//Handle Sign Up Logic
router.post("/register", function(req, res){
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if(err){
        console.log(err);
        return res.render("register", {error: err.message});
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Successfully Signed Up! Nice to meet you " + user.username);
      res.redirect("/breweries");
    });
  })
});

// Show login form
router.get("/login", function(req, res){
  res.render("login", {page: 'login'});
});

// Handle login Logic
router.post("/login", passport.authenticate("local",
{
  successRedirect: "/breweries",
  failureRedirect: "/login"
}), function(req, res){
});

// logout ROUTE
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged You Out!");
  res.redirect("/breweries")
});

module.exports = router;