'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('MapListCtrl', ['$scope', '$location', 'MapListService', 'MapService',
  	function ($scope, $location, MapListService, MapService) {
     
      $scope.maps = MapListService.query();

      $scope.newMap = function(){
        MapListService.post({name: "New Map",
							owner: 1,
							zoom: 1 ,
							center_x: 0,
							center_y: 0},
              function success(response){
                
                console.log('Success:' + JSON.stringify(response));     
                      
                     
              },
              function error(errorResponse){
                  console.log('Error:' + JSON.stringify(errorResponse));
              });

        $scope.maps = MapListService.query()
    };

    $scope.deleteMap = function(mapId){
        MapService.delete({id: mapId})

        $scope.maps = MapListService.query()
    };



  }]);
