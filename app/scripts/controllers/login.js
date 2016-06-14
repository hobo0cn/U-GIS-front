'use strict';

/* Controllers */

// angular.module('uGisFrontApp', [])
//   .controller('LoginCtrl', ['$scope', function($scope) {
//     $scope.formInfo = {};
//     $scope.saveData = function() {
//       $scope.nameRequired = '';
//       $scope.emailRequired = '';
//       $scope.passwordRequired = '';

//       if (!$scope.formInfo.Name) {
//         $scope.nameRequired = 'Name Required';
//       }

//       if (!$scope.formInfo.Email) {
//         $scope.emailRequired = 'Email Required';
//       }

//       if (!$scope.formInfo.Password) {
//         $scope.passwordRequired = 'Password Required';
//       }
//     };
//   }]);

'use strict';
angular.module('uGisFrontApp')
  .controller('LoginCtrl', ['$scope', '$location', 'TokenAuthService', 'ProfileServices',
   function ($scope, $location, TokenAuthService, ProfileServices) {
   	$scope.username = "";
   	$scope.password = "";
    //TODO test login
    
    $scope.login = function(){
        
        TokenAuthService.post({username: $scope.username, password: $scope.password},
            function success(response){
            	console.log('Success:' + JSON.stringify(response));  
                ProfileServices.setUserToken(response.token);
                ProfileServices.setUserName($scope.username);
                $location.path('/map');
                     
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
        
    }


  }]);
