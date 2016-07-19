'use strict';

function DataService ($http, $q) {

  this.getMarkers = function(callback) {
    $http.get('/api/markers').then(callback);
  };

  this.deleteMarker = function(marker) {
    console.log("I deleted the " + marker.name + " marker!");
  };

  this.saveMarkers = function(markers) {
    var queue = [];
    markers.forEach(function(marker) {
        var request;
        if(!marker._id) {
          request = $http.post('/api/markers', marker);
        } else {
          request = $http.put('/api/markers/' + marker._id, marker).then(function(result) {
            marker = result.data.marker;
            return marker;
          });
        }
        queue.push(request);
    });
    return $q.all(queue).then(function(results) {
      console.log("I saved " + markers.length + " markers!");
    });
  };

}

module.exports = DataService;
