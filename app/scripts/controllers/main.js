'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    
    $scope.todos = ['Item 1', 'Item 2', 'Item 3'];
  }]);
