angular.module('app.controllers', [])

.controller('ViewController', ($scope) => {
  // mapLoaded and 'flipMapLoaded' are used to tell if the map has loaded.
  // We use them to determine when to display the spinner
  $scope.mapLoaded = true;
  $scope.showOriginField = false;
  $scope.safeRoute;
  $scope.originCoords = {};
  $scope.destinationCoords = {};

  $scope.renderRoute = (points) => {
    const safeRoute = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    safeRoute.setMap(map);
  };

  $scope.flipMapLoaded = () => {
    $scope.mapLoaded = !$scope.mapLoaded;
    $scope.$apply();
  };

  $scope.editHandler = () => {
    $scope.showOriginField = !$scope.showOriginField;
  };

  $scope.setPos = (currentPosition) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentPosition.lat},${currentPosition.lng}&key=AIzaSyBgXiNUqN5OlBHE7hAVxV9phqHQrfKldXw`;
    
    fetch(url)
    .then(addressData => addressData.json())
    .then((addressDataJSON) => {
      const longAddress = addressDataJSON.results[0].formatted_address;
      const arrSplit = longAddress.split(',');

      shortAddress = `${arrSplit[0]},${arrSplit[1]}`;
      currentPosition.address = shortAddress;
      $scope.pos = currentPosition;
      $scope.$apply();
    });
  };

  // submitHandler takes the form values, performs a get request to the API with
  // those values and then displays the results on the page
  // in the form of a drawn polyline and a link to the directions in google maps
  $scope.submitHandler = (destination, mobile, origin) => {
    console.log('destination: ', destination);
    console.log('mobile: ', mobile);
    console.log('origin: ', origin);

    let locationURL = '/safestRoute?';
    locationURL += (`originLat=${$scope.originCoords.lat}`);
    locationURL += (`&originLon=${$scope.originCoords.lng}`);
    locationURL += (`&destLat=${$scope.destinationCoords.lat}`);
    locationURL += (`&destLon=${$scope.destinationCoords.lng}`);

    if (mobile) {
      locationURL += (`&mobile=${mobile}`);
    }

    fetch(locationURL)
    .then(route => route.json())
    .then((jsonRoute) => {
      $scope.safeRoute = jsonRoute;
      $scope.renderRoute($scope.safeRoute.waypoints);
      $scope.$apply();
    })
    .catch((err) => {
      console.log('There was an error', err);
    });
  };
});
