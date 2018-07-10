'use strict';

const chai                = require('chai');
const chaiHttp            = require('chai-http');
const mongoose            = require('mongoose');
const Brewery             = require("../models/breweries");
const Comment             = require("../models/comment");
const middleware          = require("../middleware");
const indexRoutes         = require("../routes/index");
const express             = require("express");
const router              = express.Router();

// this makes the expect syntax available throughout
// this module
const expect = chai.expect;

const { app, runServer, closeServer } = require('../app');
const {TEST_DATABASE_URL} = require('../config');

          chai.use(chaiHttp);
                // used to put randomish documents in db
                // so we have data to work with and assert about.
                // generate placeholder values for author, title, content
                // and then we insert that data into mongo
                function seedBreweryData() {
                  console.info('seeding brewery data');
                  const seedData = [];

                  for (let i=1; i<=10; i++) {
                    seedData.push(generateBreweryData());
                  }
                  // this will return a promise
                  return Brewery.insertMany(seedData);
                }

                // used to generate data to put in db
                function generateBreweryName() {
                  const breweries = [
                    'Roc Brewing', 'Lost Borough', 'Brooklyn Brewing', 'Rohrbach Brewing', 'Fairport Brewing'];
                  return breweries[Math.floor(Math.random() * breweries.length)];
                }

                // used to generate data to put in db
                function generatePricePerBeer() {
                  const prices = ['5', '6', '7'];
                  return prices[Math.floor(Math.random() * prices.length)];
                }

                // used to generate data to put in db
                function generateImage() {
                  const image =
                  ["https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
                   "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
                   "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg"];
                  return image[Math.floor(Math.random() * image.length)];
                }

                // used to generate data to put in db
                function generateDescription() {
                  const description =
                  ['Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore',
                   'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore',
                   'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore',
                   'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore',
                   'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore'];
                  return description[Math.floor(Math.random() * description.length)];
                }

                // generate an object represnting a brewery.
                // can be used to generate seed data for db
                // or request.body data
                function generateBreweryData() {
                  return {
                    name: generateBreweryName(),
                    price: generatePricePerBeer(),
                    image: generateImage(),
                    description: generateDescription()
                  };
                }

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Breweries API resource', function() {

  // we need each of these hook functions to return a promise
  // otherwise we'd need to call a `done` callback. `runServer`,
  // `seedRestaurantData` and `tearDownDb` each return a promise,
  // so we return the value returned by these function calls.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBreweryData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

// note the use of nested `describe` blocks.
// this allows us to make clearer, more discrete tests that focus
// on proving something small
describe('GET endpoint', function() {

  it('should return all existing breweries', function() {
    // strategy:
    //    1. get back all breweries returned by by GET request to `/breweries`
    //    2. prove res has right status, data type
    let res;
    return chai.request(app)
      .get('/breweries')
      .then(function(_res) {
        // so subsequent .then blocks can access response object
        res = _res;
        expect(res).to.have.status(200);
        // otherwise our db seeding didn't work
        expect(res).to.be.an('object');
        });
      });
    });
  });
