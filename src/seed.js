'use strict';

var Marker = require('./models/marker');

var markers = [
	'[12.22349, 34.1234234]',
  '[125.22349, -4.1234234]',
	'[17.22349, 56.1234234]'
];

markers.forEach(function (marker, index) {
  Marker.find({ 'latLng': marker }, function(err, markers) {
  	if (!err && !markers.length) {
      Marker.create({ latLng: marker });
  	}
  });
});
