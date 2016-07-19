'use strict'

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/travelografo', function(err) {
  if(err) {
    console.log("There was an error connecting to MongoDB!");
  } else {
    console.log("Successfully connected to Mongo!");
  }
});
