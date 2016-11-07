'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('RegisterCtrl', ['$scope', '$location', 'RegisterRequestService',
  	 function ($scope, $location, RegisterRequestService) {
	    $scope.username = "";
	    $scope.email = ""
   		$scope.password = "";
      $scope.error_used_email = 0;
      $scope.error_used_username = 0;
	    
	    $scope.register = function(){
	        
	        RegisterRequestService.post({name: $scope.username, 
	        				  password: $scope.password,
	        				  email: $scope.email,
	        				  user_cate: "O"},

            function success(response){
            	console.log('Success:' + JSON.stringify(response));  
              //TODO 跳转到打开邮件提示页面
              $scope.error_used_email = 0;
              $scope.error_used_username = 0;
                     
            },
            function error(errorResponse){
            	//TODO 处理重复注册的错误
                console.log('Error:' + JSON.stringify(errorResponse));
                if (errorResponse.data.error_code == 124) {
                  //TODO 重复的邮箱名称
                  $scope.error_used_email = 1;
                }
                else if (errorResponse.data.error_code == 125) {
                  $scope.error_used_username = 1;
                }
            });
	    };
    
  }]);
