'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('MapViewCtrl', ['$scope', '$routeParams', 'MapService', 
  	function ($scope, $routeParams, MapService) {
     
      var mapId = $routeParams.id;
      MapService.get({id: mapId},
          function success(response){
            $scope.map = response;
            console.log("Success:" + JSON.stringify(response));
          },
          function error(errorResponse){
            console.log("Error:" + JSON.stringify(errorResponse));
          }
        );


  }]);
