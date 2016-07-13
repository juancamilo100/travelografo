angular.module('travelografoApp', ['ngMap'])
  .controller('mainCtrl', function(NgMap, $scope) {
    console.log("NgMap: ", NgMap);
    NgMap.getMap().then(function(map) {
      $scope.map = map
      console.log(map.getCenter());
      console.log('map: ', map);
      console.log('markers: ', map.customMarkers);
      // console.log('shapes', map.shapes);
    });

    $scope.click = function(event) {
            console.log("Click on: " + event.latLng);
            var marker = new google.maps.Marker({position: event.latLng, map: $scope.map});
            console.log("Makers: ", $scope.markers);
            $scope.markers[$scope.markers.length] = event.latLng;
            // $scope.map.setCenter(event.latLng);
        };

    $scope.markers = [];
});
