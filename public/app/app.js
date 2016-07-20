angular.module('travelografoApp', ['ngMap'])
    .controller('mainCtrl', function(NgMap, $scope, dataService) {

        function createBlogsFromDatabase() {
           $scope.markers.forEach(function(marker) {
            var coordinates = marker.latLng.toString().replace('[', '(').replace(']', ')');
            console.log("maker coordinates: " + coordinates);
             createBlog(coordinates);
           })
        };

        function updateMarkersFromDatabase() {
            dataService.getMarkers(function(response) {
                var markers = response.data.markers;

                var marker = {
                    id: "",
                    latLng: ""
                }

                markers.forEach(function(marker, index) {
                    marker.id = markers[index]._id;
                    marker.latLng = markers[index].latLng;
                    $scope.markers[index] = marker;
                });
            });
        }

        updateMarkersFromDatabase();

        $scope.saveMarkers = function() {
            dataService.saveMarkers($scope.markers);
        };

        function createBlog(coordinates) {
            console.log("Creating blogs");
            var blog = {
                city: "",
                state: "",
                country: ""
            }

            var geocoder = new google.maps.Geocoder();
            // console.log("Coordinates: " + coordinates);
            geocoder.geocode({
                'latLng': coordinates
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {

                        var city = "";
                        var state = "";
                        var country = "";
                        for (var addressItem in results[1].address_components) {
                            var dataType = results[1].address_components[addressItem].types[0]

                            switch (dataType) {
                                case "locality":
                                    blog.city = results[1].address_components[addressItem].long_name;
                                    // console.log("City: " + blog.city);
                                    break;

                                case "administrative_area_level_1":
                                    blog.state = results[1].address_components[addressItem].short_name;
                                    // console.log("State: " + blog.state);
                                    break;

                                case "country":
                                    blog.country = results[1].address_components[addressItem].long_name;
                                    // console.log("Country: " + blog.country);
                                    break;

                                default:
                            }
                        }
                        // console.log("Blog: " + blog.city);
                        if(blog.city == "") {
                          blog.city = "City Not Found"
                        }
                        $scope.blogs.push(blog);
                        console.log("Blogs: " + $scope.blogs);
                    } else {
                        console.log('Location not found');
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                }
            })
        };

        function createMarker(event) {
            // console.log("Create Marker");
            var marker = {
                id: "",
                latLng: ""
            }

            marker.latLng = event.latLng.toString().replace('(', '[').replace(')', ']');
            $scope.markers[$scope.markers.length] = marker;
            dataService.saveMarkers($scope.markers);
            updateMarkersFromDatabase();
        }

        $scope.click = function(event) {
            createMarker(event);
            createBlog(event.latLng);
        };

        $scope.deleteMarker = function(event) {

            var index = $scope.markers.map(function(marker) {
                return marker.latLng;
            }).indexOf(event.latLng.toString().replace('(', '[').replace(')', ']'));

            dataService.deleteMarker($scope.markers[index], function(response) {
                console.log("Marker Deleted: " + response.data);
            })
            $scope.markers.splice(index, 1);
            $scope.blogs.splice(index, 1);
        }

        $scope.markers = [];
        $scope.blogs = [];

        $scope.updateMarker = function(event) {
          var newlatLng = event.latLng.toString().replace('(', '[').replace(')', ']');
          $scope.markers[this.index].latLng = newlatLng;
          dataService.saveMarkers($scope.markers);
        }
    })

.service('dataService', function($http, $q) {
    this.getMarkers = function(callback) {
        $http.get('/api/markers').then(callback);
    };

    this.deleteMarker = function(marker, callback) {
        $http.delete('/api/markers/' + marker.id, marker).then(callback);
    };

    this.saveMarkers = function(markers) {
        var queue = [];
        markers.forEach(function(marker) {
            var request;
            if (marker.id == "") {
                request = $http.post('/api/markers', marker);
            } else {
                request = $http.put('/api/markers/' + marker.id, marker).then(function(result) {
                    marker = result.data.marker;
                    return marker;
                });
            }
            queue.push(request);
        });
        return $q.all(queue).then(function(results) {
            // console.log("I saved: " + results);
        });
    };

    this.updateMarker - function(marker, callback) {
      $http.put('/api/markers/' + marker.id, marker).then(callback);
    }
});
