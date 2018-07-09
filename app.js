const express             = require('express');
const app                 = express();
const bodyParser          = require("body-parser");
const mongoose            = require("mongoose");
const flash               = require("connect-flash");
const passport            = require("passport");
const LocalStrategy       = require("passport-local")
const Brewery             = require("./models/breweries");
const Comment             = require("./models/comment");
const User                = require("./models/user");
const seedDB              = require("./seeds");
const {PORT, DATABASE_URL} = require('./config');
const methodOverride      = require("method-override");

// Import Routes
const commentRoutes       = require("./routes/comments");
const breweriesRoutes     = require("./routes/breweries");
const indexRoutes         = require("./routes/index");

mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost/nodeCapstone2");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //Seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "iLoveDarkCoffee",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//END PASSPORT CONFIGURATION ^^^

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/breweries", breweriesRoutes);
app.use("/breweries/:id/comments", commentRoutes)

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if app.js is called directly (aka, with `node app.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
