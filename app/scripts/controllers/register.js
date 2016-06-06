'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('RegisterCtrl', ['$scope', '$location', function ($scope, $location) {
	    //TODO test register
	    $scope.register = function(){
	        $location.path('/dashboard');
	    };
    
  }]);
