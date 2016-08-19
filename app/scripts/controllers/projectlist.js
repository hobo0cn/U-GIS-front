'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('ProjectListCtrl', ['$scope', '$location', '$cookies', 'MapListService', 
    'MapService', 'LayerService', 'ProfileServices',
  	function ($scope, $location, $cookies, MapListService, MapService, LayerService, ProfileServices) {
     
      $scope.username = $cookies.get('EDM_username');

      $scope.toggle = function (scope) {
        scope.toggle();
      };

      $scope.refresh = function(){
          MapListService.get({owner__username: $cookies.get('EDM_username')},
            function success(response){
               $scope.maps = response;    
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
      };
      
      $scope.refresh();

      $scope.newProject = function(){
        //创建新地图，跳转到创建project页面
         $location.path('/newproject');
      };

      $scope.deleteProject = function(mapId){
          MapService.delete({id: mapId},
            function success(response){
               $scope.refresh();   
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });

      };

      $scope.newTask = function(scope){
        //创建新任务，跳转到创建task页面
        var mapData = scope.map;
        $location.path('/project/' + mapData.id + '/newtask');
      }

      // $scope.toggle = function (scope) {
        
      // };

      $scope.editTask = function(scope){
        //编辑任务，跳转到task页面
        var taskData = scope.layer_set;
        
      }

      $scope.deleteTask = function(projectId, taskId){
          LayerService.delete({mapid: projectId, layerid: taskId},
            function success(response){
               $scope.refresh();   
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
          
      };

      

  }]);
