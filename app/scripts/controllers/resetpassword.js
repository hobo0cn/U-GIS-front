'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:ForgetPasswordCtrl
 * @description
 * # ForgetPasswordCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('ResetPasswordCtrl', ['$scope', '$location', '$routeParams', 'ResetPasswordConfirmService',
  	function ($scope, $location, $routeParams, ResetPasswordConfirmService) {
      $scope.error_diff_confirm_pwd = 0;

	    $scope.resetPwd = function(){
          $scope.error_diff_confirm_pwd = 0;
          
	        ResetPasswordConfirmService.post({new_password: $scope.new_password,
                                            confirm_password: $scope.confirm_password,
                                            token: $routeParams.token},

            function success(response){
            	console.log('Success:' + JSON.stringify(response));  
            	//TODO 提示修改密码成功
              $scope.change_pwd_success = 1;
                     
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
                if (errorResponse.data.error_code == 127) {
                  //两次密码不一致
                  $scope.error_diff_confirm_pwd = 1;
                }
               
            });
	    };



    
  }]);
