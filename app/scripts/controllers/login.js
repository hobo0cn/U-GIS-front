
'use strict';
angular.module('uGisFrontApp')
  .controller('LoginCtrl', ['$scope', '$location', '$cookies', 'TokenAuthService', 
    'ProfileServices',  'ProfileInfoService',
   function ($scope, $location, $cookies, TokenAuthService, 
    ProfileServices, ProfileInfoService) {
   	$scope.username = "";
   	$scope.password = "";
    $scope.error_username_or_pwd = 0;
    $scope.isAutoLogin =  $cookies.get('EDM_isAutoLogin');


    var _routeByUserCategory = function(usercat){
      if (usercat == 'A') {
        $location.path('/project');
      }
      else if (usercat == 'P' ) {
        $location.path('/task');
      }
      else if(usercat == 'S'){
        $location.path('/datadashboard');
      }
      else if (usercat == 'O') {
        $location.path('/dashboard');
      }
    };

    $scope.login = function(){
        $cookies.put('EDM_isAutoLogin', $scope.isAutoLogin);

        TokenAuthService.post({username: $scope.username, password: $scope.password},
            function success(response){
            	console.log('Success:' + JSON.stringify(response));
                $scope.error_username_or_pwd = 0;  
                $cookies.put('EDM_username', $scope.username);
                $cookies.put('EDM_usertoken', response.token);
                $cookies.put('EDM_usercat',   response.user_cat);
                $cookies.put('EDM_userid',   response.id);
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

    $scope.isAutoLogin =  $cookies.get('EDM_isAutoLogin');
    //如果是自动登录，则直接调用缓存中的username和token进行验证
    if ($scope.isAutoLogin == 'true' ) {
      ProfileInfoService.get({userid: $cookies.get('EDM_userid')}, 
            function success(response){
              console.log('Success:' + JSON.stringify(response));
                $scope.error_username_or_pwd = 0;  
                $cookies.put('EDM_username', response.username);
                $cookies.put('EDM_usercat',   response.user_cate);
                $cookies.put('EDM_userid',   response.id);
                //判断用户类型，跳转到不同的页面
                _routeByUserCategory(response.user_cate)
                     
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
                if (errorResponse.status == 401) {
                  //错误的用户名或密码
                   $scope.error_username_or_pwd = 1;
                }
            });
    }


  }]);
