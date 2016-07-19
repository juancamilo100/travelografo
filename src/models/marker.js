'use strict';

var mongoose = require('mongoose');

var markerSchema = new mongoose.Schema({
	latLng: String
});

var model = mongoose.model('Marker', markerSchema);

module.exports = model;
