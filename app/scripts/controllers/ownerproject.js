
'use strict';
angular.module('uGisFrontApp')
  .controller('OwnerProjectCtrl', 
    ['$scope', '$location', '$cookies', 'MapListService', 
   function ($scope, $location, $cookies, MapListService) {
  
      var _getOwneProjects = function(){
           MapListService.query({owner__username: $cookies.get('EDM_username'), 
                                  status: 'D'},

              function success(response){
                $scope.projects = response;     
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              });
        };

      _getOwneProjects();


  }]);
