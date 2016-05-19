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

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
  .controller('LoginCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
