
'use strict';
angular.module('uGisFrontApp')
  .controller('OwnerDashboardCtrl', 
    ['$scope', '$location', '$cookies', 'MapListService', 
   function ($scope, $location, $cookies, MapListService) {
      $scope.username = $cookies.get('EDM_username');
      $scope.usercat =  $cookies.get('EDM_usercat');
      $scope.search_txt = "";

      if ($scope.username == null) {
        $location.path("#/login");
      }

      var _getOwneProjects = function(){

           MapListService.query({owner: $cookies.get('EDM_username'), 
                                  status: 'D'},

              function success(response){
                $scope.projects = response;     
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
                if (errorResponse.status == 401) {
                 
                  $location.path("#/login");
                }
              });
        };

        
        $scope.searchProject = function(){

            if ($scope.search_txt=="") {
              _getOwneProjects();
            }
            else {
              MapListService.query({owner: $cookies.get('EDM_username'), 
                                    status: 'D',
                                    name: $scope.search_txt},

                function success(response){
                  $scope.projects = response;     
                },
                function error(errorResponse){
                  console.log('Error:' + JSON.stringify(errorResponse));
                });
            }
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

  
