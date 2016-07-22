'use strict';

var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
  title: String,
  body: String,
});

var model = mongoose.model('Blog', blogSchema);

module.exports = model;
