'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('uploadDlgCtrl', ['$scope','SelectFilesServices',
   function ($scope, SelectFilesServices) {
    $scope.flowObj = SelectFilesServices.getFlow()

  }]);
