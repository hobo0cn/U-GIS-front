'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:ForgetPasswordCtrl
 * @description
 * # ForgetPasswordCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('ForgetPasswordCtrl', ['$scope', '$location', function ($scope, $location) {
	    //TODO test register
	    $scope.register = function(){
	        $location.path('/dashboard');
	    };
    
  }]);
