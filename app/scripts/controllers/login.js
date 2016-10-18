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
    $scope.error_username_or_pwd = 0;
      
    var _routeByUserCategory = function(usercat){
      if (usercat == 'A') {
        $location.path('/project');
      }
      else if (usercat == 'P' || usercat == 'S') {
        $location.path('/task');
      }
      else if (usercat == 'O') {
        $location.path('/dashboard');
      }
    };

    $scope.login = function(){
        
        TokenAuthService.post({username: $scope.username, password: $scope.password},
            function success(response){
            	console.log('Success:' + JSON.stringify(response));
                $scope.error_username_or_pwd = 0;  
                $cookies.put('EDM_username', $scope.username);
                $cookies.put('EDM_usertoken', response.token);
                $cookies.put('EDM_usercat',   response.user_cat);
                //判断用户类型，跳转到不同的页面
                _routeByUserCategory(response.user_cat)
                     
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
                if (errorResponse.status == 400) {
                  //错误的用户名或密码
                   $scope.error_username_or_pwd = 1;
                }
            });
        
    };

    $scope.newuser = function(){
        $location.path('/register');
    };

   



  }]);
