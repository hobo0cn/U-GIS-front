'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('MainCtrl', ['$scope', 'UProject', function ($scope, UProject) {
    UProject.set("3");
    
    $scope.todos = ['Item 1', 'Item 2', 'Item 3'];
  }]);
