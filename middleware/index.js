
const Brewery    = require("../models/breweries");
const Comment    = require("../models/comment");

// ALL MIDDLEWARE GOES HERE
let middlewareObj = {};

middlewareObj.checkBreweryOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Brewery.findById(req.params.id, function(err, foundBrewery){
        if(err){
          req.flash("error", "Brewery not found");
          res.redirect("back")
        } else {
          // Does user own the Brewery??
          // Using Mongoose equals method to ensure the user ID === Brewery Author ID
          if(foundBrewery.author.id.equals(req.user._id)){
            next();
          } else {
            req.flash("error", "You dont have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      res.redirect("back");
    }
  }

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
          res.redirect("back")
        } else {
          // Does user own the comment??
          // Using Mongoose equals method to ensure the user ID === Brewery Author ID
          if(foundComment.author.id.equals(req.user._id)){
            next();
          } else {
            req.flash("error", "You don't have permission to do that");
            res.redirect("back");
          }
        }
      });
    } else {
      req.flash("error", "You need to be logged in to do that!");
      res.redirect("back");
    }
  }

  middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login");
  }

module.exports = middlewareObj
