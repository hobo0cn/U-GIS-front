'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('MapListCtrl', ['$scope', '$location', 'MapListService', 
    'MapService', 'ProfileServices',
  	function ($scope, $location, MapListService, MapService, ProfileServices) {
     
      $scope.maps = MapListService.query({owner__username: ProfileServices.getUserName()});

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
