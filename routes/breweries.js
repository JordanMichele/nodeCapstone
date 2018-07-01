const express    = require("express");
const router     = express.Router();
const Brewery    = require("../models/breweries");
const middleware = require("../middleware");

//INDEX - show all breweries
router.get("/", function(req, res){
  //Get all breweries from DB
  Brewery.find({}, function(err, allBreweries){
    if(err) {
      console.log(err);
    } else{
      res.render("breweries/index", {breweries: allBreweries, page: 'breweries'});
    }
  });
});

// Create - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to breweries array
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newBrewery = {name: name, price: price, image: image, description: desc, author: author}
  //create a new brewery and save to database
  Brewery.create(newBrewery, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // redirect back to breweries page
      console.log(newlyCreated);
      res.redirect("/breweries")
    }
  });
});

//New - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("breweries/new");
});

//SHOW - shows more info about one brewery
router.get("/:id", function(req, res){
  //find brewery with provided ID
  Brewery.findById(req.params.id).populate("comments").exec(function(err, foundBrewery){
    if(err){
      console.log(err);
    } else{
      //Render show template with that Brewery
      res.render("breweries/show", {brewery: foundBrewery});
    }
  });
})

//Edit Brewery Route
router.get("/:id/edit", middleware.checkBreweryOwnership, function(req, res){
    Brewery.findById(req.params.id, function(err,foundBrewery){
          res.render("breweries/edit", {brewery: foundBrewery});
      });
    });

//Update Brewery Route
router.put("/:id", middleware.checkBreweryOwnership, function(req, res){
  //find and update the correct brewery
  Brewery.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedBrewery){
    if(err){
      res.redirect("/breweries");
    } else {
      res.redirect("/breweries/" + req.params.id)
    }
  });
  //redirect somewhere(showpage)
});

//Destroy Campground Route
router.delete("/:id", middleware.checkBreweryOwnership, function(req, res){
  Brewery.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/breweries");
    } else {
      res.redirect("/breweries");
    };
  });
});

module.exports = router;