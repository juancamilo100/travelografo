angular.module('travelografoApp', ['ngMap'])
    .controller('mainCtrl', function(NgMap, $scope) {
        console.log("NgMap: ", NgMap);
        NgMap.getMap().then(function(map) {
            $scope.map = map
                // console.log(map.getCenter());
                // console.log('map: ', map);
                // console.log('markers: ', map.customMarkers);
                // console.log('shapes', map.shapes);
        });

        $scope.click = function(event) {

            var blog = {
              city: "",
              state: "",
              country: ""
            }

            var geocoder = new google.maps.Geocoder();
            $scope.markers[$scope.markers.length] = event.latLng.toString().replace('(', '[').replace(')', ']');

            geocoder.geocode({
                'latLng': event.latLng
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
                                    break;

                                case "administrative_area_level_1":
                                    blog.state = results[1].address_components[addressItem].short_name;
                                    break;

                                case "country":
                                    blog.country = results[1].address_components[addressItem].long_name;
                                    break;

                                default:
                            }
                        }

                        $scope.blogs[$scope.blogs.length] = blog;
                    } else {
                        console.log('Location not found');
                    }
                } else {
                    console.log('Geocoder failed due to: ' + status);
                }
            });
        };

        $scope.deleteMarker = function(event) {
            var index = $scope.markers.indexOf(event.latLng.toString().replace('(', '[').replace(')', ']'));
            $scope.markers.splice(index, 1);
            $scope.blogs.splice(index, 1);
        }

        $scope.callbackFunc = function(param) {
            console.log('I know where ' + param + ' are. ' + vm.message);
            console.log('You are at' + vm.map.getCenter());
        };

        $scope.markers = [];
        $scope.blogs = [];
    });
