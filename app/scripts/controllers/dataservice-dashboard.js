
'use strict';
angular.module('uGisFrontApp')
  .controller('DataServiceDashboardCtrl', ['$scope', '$location', '$cookies', 'TaskService', 'LayerService',
   function ($scope, $location, $cookies, TaskService, LayerService) {
  
      $scope.username = $cookies.get('EDM_username');
      var _getTasks = function(){
           TaskService.get(
              function success(response){
                $scope.tasks = response;
                console.log('Success:' + JSON.stringify(response));
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
        };

      _getTasks();

      $scope.acceptTask = function (projectid, taskid) {
          LayerService.update({mapid: projectid, layerid: taskid, status: 'FI', 
                              map: projectid, stack_order: 1},
              function success(response){
                console.log('Success:' + JSON.stringify(response));
                _getTasks();
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
      };

      $scope.uploadPhoto = function (projectid, taskid) {
         var uploadpath = '/upload/' + projectid + '/' + taskid;
         $location.path(uploadpath); 
      };

      $scope.acceptServiceTask = function (projectid, taskid) {
          LayerService.update({mapid: projectid, layerid: taskid, status: 'P', 
                              map: projectid, stack_order: 1},
              function success(response){
                console.log('Success:' + JSON.stringify(response));
                _getTasks();
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
      };



  }]);
