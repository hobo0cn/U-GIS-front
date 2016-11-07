'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:ForgetPasswordCtrl
 * @description
 * # ForgetPasswordCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('ForgetPasswordCtrl', ['$scope', '$location', 'ResetPasswordService',
  	function ($scope, $location, ResetPasswordService) {
	    
	    $scope.verify_code = "";
	    $scope.email = ""
	    $scope.error_no_email = 0;
	    $scope.inputVerifyCode = ""
		$scope.error_verifycode = 0;
		$scope.send_email_success = 0;
	    $scope.createVerifyCode = function() {
			 var seed = new Array(  
                    'abcdefghijklmnopqrstuvwxyz',  
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',  
                    '0123456789'  
            );               //创建需要的数据数组  
            var idx,i;  
            var result = '';   //返回的结果变量  
            for (i=0; i<4; i++) //根据指定的长度  
            {  
                idx = Math.floor(Math.random()*3); //获得随机数据的整数部分-获取一个随机整数  
                result += seed[idx].substr(Math.floor(Math.random()*(seed[idx].length)), 1);//根据随机数获取数据中一个值  
            }  
            $scope.verify_code = result;
            return result; //返回随机结果  

	    };

	    $scope.checkVerifyCode = function() {
	    	if ($scope.verify_code == $scope.inputVerifyCode) {
	    		return true;
	    	}
	    	return false;
	    };

	    $scope.createVerifyCode();

	    $scope.resetPwd = function(){

	    	if (!($scope.checkVerifyCode())) {
	    		$scope.error_verifycode = 1;
	    		return;
	    	}
	    	$scope.error_verifycode = 0;
	        
	        ResetPasswordService.post({email: $scope.email},

            function success(response){
            	console.log('Success:' + JSON.stringify(response));  
            	$scope.error_verifycode = 0;
            	$scope.error_no_email = 0;

              //TODO 跳转到发送邮件成功提示页面
              $scope.send_email_success = 1;
                     
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
                if (errorResponse.data.error_code == 126) {
                  //TODO 没有这个注册的用户邮箱
                  $scope.error_no_email = 1;
                }
               
            });
	    };



    
  }]);
