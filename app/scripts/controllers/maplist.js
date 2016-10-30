'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('MapListCtrl', ['$scope', '$location', '$cookies', 'MapListService', 
    'MapService', 'ProfileServices',
  	function ($scope, $location, $cookies, MapListService, MapService, ProfileServices) {
     
      $scope.maps = MapListService.get({owner: $cookies.get('EDM_username')});
      

      $scope.newMap = function(){
        MapListService.post({name: "New Map",
							// owner: 1,
							zoom: 1 ,
							center_x: 0,
							center_y: 0})

        $scope.maps = MapListService.query()
    };

    $scope.deleteMap = function(mapId){
        MapService.delete({id: mapId})

        $scope.maps = MapListService.query()
    };



  }]);
