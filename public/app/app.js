angular.module('travelografoApp', ['ngMap', 'ngRoute'])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/page1', {
                templateUrl : '/templates/page1.html',
                controller  : 'mainCtrl'
            })
            .when('/page2', {
                templateUrl : '/templates/page2.html',
                controller  : 'mainCtrl'
            })

            $locationProvider.html5Mode({enabled: true, requireBase: false});
          })
    .controller('mainCtrl', function(NgMap, $scope, markerDataService, blogDataService) {

        function createBlogsFromDatabase() {
            $scope.markers.forEach(function(marker) {
                var coordinates = marker.latLng.toString().replace('[', '(').replace(']', ')');
                createBlog(coordinates);
            })
        };

        function updateMarkersFromDatabase() {
            markerDataService.getMarkers(function(response) {
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
                // createBlogsFromDatabase();
            });
        }

        function updateBlogsFromDatabase() {
            blogDataService.getBlogs(function(response) {
                var blogs = response.data.blogs;

                var blog = {
                    id: "",
                    city: "",
                    state: "",
                    country: "",
                    title: "",
                    body: ""
                }

                blogs.forEach(function(blog, index) {
                    blog.id = blogs[index]._id;
                    blog.city = blogs[index].city;
                    blog.state = blogs[index].state;
                    blog.country = blogs[index].country;
                    blog.title = blogs[index].title;
                    blog.body = blogs[index].body;

                    $scope.blogs[index] = blog;
                });
                // createBlogsFromDatabase();
            });
        }

        updateMarkersFromDatabase();
        updateBlogsFromDatabase();

        $scope.saveMarkers = function() {
            markerDataService.saveMarkers($scope.markers);
        };

        function getLocationDetails(coordinates, callback) {
            var locationDetails = {
                city: "",
                state: "",
                country: ""
            }

            var geocoder = new google.maps.Geocoder();

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
                                    locationDetails.city = results[1].address_components[addressItem].long_name;
                                    break;

                                case "administrative_area_level_1":
                                    locationDetails.state = results[1].address_components[addressItem].short_name;
                                    break;

                                case "country":
                                    locationDetails.country = results[1].address_components[addressItem].long_name;
                                    break;

                                default:
                            }
                        }
                        if (locationDetails.city == "") {
                            locationDetails.city = "City Not Found"
                        }
                        callback(locationDetails);
                    } else {
                        console.log('Location not found');
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                }
            })
        }

        function createBlog(coordinates) {
            getLocationDetails(coordinates, function(locationDetails) {
                var blog = {
                    id: "",
                    city: "",
                    state: "",
                    country: "",
                    title: "",
                    body: ""
                }

                blog.city = locationDetails.city;
                blog.state = locationDetails.state;
                blog.country = locationDetails.country;

                $scope.blogs.push(blog);
                blogDataService.saveBlogs($scope.blogs);
                updateBlogsFromDatabase();
            });
        };

        function createMarker(event) {
            var marker = {
                id: "",
                latLng: ""
            }

            marker.latLng = event.latLng.toString().replace('(', '[').replace(')', ']');
            $scope.markers[$scope.markers.length] = marker;
            markerDataService.saveMarkers($scope.markers);
            updateMarkersFromDatabase();
        }

        $scope.deleteAllBlogsAndMarkers = function(event) {

          for(var index = 0; index < $scope.blogs.length; index++) {
              markerDataService.deleteMarker($scope.markers[index], function(response) {
                  $scope.markers.splice(0, $scope.markers.length);
              })

              blogDataService.deleteBlog($scope.blogs[index], function(response) {
                  $scope.blogs.splice(0, $scope.blogs.length)
              })
          }
        }

        $scope.click = function(event) {
            createMarker(event);
            createBlog(event.latLng);
        };

        $scope.deleteMarkerAndBlog = function(event) {

            markerDataService.deleteMarker($scope.markers[this.index], function(response) {
                //console.log("Marker Deleted: " + response.data);
                $scope.markers.splice(this.index, 1);
                updateMarkersFromDatabase();
            })

            blogDataService.deleteBlog($scope.blogs[this.index], function(response) {
                //console.log("Blog Deleted: " + response.data);
                $scope.blogs.splice(this.index, 1);
                updateBlogsFromDatabase();
            })
        }

        $scope.markers = [];
        $scope.blogs = [];

        $scope.updateMarker = function(event) {
            var newlatLng = event.latLng.toString().replace('(', '[').replace(')', ']');
            var index = this.index;
            $scope.markers[index].latLng = newlatLng;
            markerDataService.saveMarkers($scope.markers);
            updateMarkersFromDatabase();

            getLocationDetails(event.latLng, function(locationDetails) {
                $scope.blogs[index].city = locationDetails.city;
                $scope.blogs[index].state = locationDetails.state;
                $scope.blogs[index].country = locationDetails.country;

                blogDataService.saveBlogs($scope.blogs);
                updateBlogsFromDatabase();
            });
        }
    })

.service('markerDataService', function($http, $q) {
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
})

.service('blogDataService', function($http, $q) {
    this.getBlogs = function(callback) {
        $http.get('/api/blogs').then(callback);
    };

    this.deleteBlog = function(blog, callback) {
        console.log("Blog ID: " + blog.id);
        $http.delete('/api/blogs/' + blog.id, blog).then(callback);
    };

    this.saveBlogs = function(blogs) {
        var queue = [];
        blogs.forEach(function(blog) {
            var request;
            if (blog.id == "") {
                request = $http.post('/api/blogs', blog);
            } else {
                request = $http.put('/api/blogs/' + blog.id, blog).then(function(result) {
                    blog = result.data.blog;
                    return blog;
                });
            }
            queue.push(request);
        });
        return $q.all(queue).then(function(results) {});
    };

    this.updateBlog - function(blog, callback) {
        $http.put('/api/blogs/' + blog.id, blog).then(callback);
    }
});
