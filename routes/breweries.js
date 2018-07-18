const express    = require("express");
const router     = express.Router();
const Brewery    = require("../models/breweries");
const middleware = require("../middleware");
const NodeGeocoder = require('node-geocoder');

let options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

let geocoder = NodeGeocoder(options);

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

//CREATE - add new Brewery to DB
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
  //Utilize the Geocode/ Google Maps API to take the location from the form and submit it
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    let lat = data[0].latitude;
    let lng = data[0].longitude;
    let location = data[0].formattedAddress;
    let newBrewery = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
    // Create a new brewery and save to DB
    Brewery.create(newBrewery, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to breweries page
            console.log(newlyCreated);
            res.redirect("/breweries");
        }
    });
  });
});

//New - show form to create new brewery
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

// UPDATE CAMPGROUND ROUTE
  router.put("/:id", middleware.checkBreweryOwnership, function(req, res){
      geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.brewery.lat = data[0].latitude;
        req.body.brewery.lng = data[0].longitude;
        req.body.brewery.location = data[0].formattedAddress;

        Brewery.findByIdAndUpdate(req.params.id, req.body.brewery, function(err, brewery){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success","Successfully Updated!");
                res.redirect("/breweries/" + brewery._id);
            }
        });
      });
    });

//Destroy Brewery Route
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
