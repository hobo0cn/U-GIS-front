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
  .controller('LoginCtrl', ['$scope', '$location', '$cookies', 'TokenAuthService', 'ProfileServices',
   function ($scope, $location, $cookies, TokenAuthService, ProfileServices) {
   	$scope.username = "";
   	$scope.password = "";
    //TODO test login
       $scope.popup2 = {
        opened: false
      };

      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };
    $scope.login = function(){
        
        TokenAuthService.post({username: $scope.username, password: $scope.password},
            function success(response){
            	console.log('Success:' + JSON.stringify(response));  
                $cookies.put('EDM_username', $scope.username);
                $cookies.put('EDM_usertoken', response.token);
                //TODO 判断用户类型，跳转到不同的页面
                $location.path('/dashboard');
                     
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
        
    }


  }]);
