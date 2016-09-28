
'use strict';
angular.module('uGisFrontApp')
  .controller('OwnerDashboardCtrl', 
    ['$scope', '$location', '$cookies', 'MapListService', 
   function ($scope, $location, $cookies, MapListService) {
      $scope.username = $cookies.get('EDM_username');
      $scope.usercat =  $cookies.get('EDM_usercat');

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

  angular.module('uGisFrontApp')
  .controller("TabController", function() {
    this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
      this.tab = setTab;
    };
  });
