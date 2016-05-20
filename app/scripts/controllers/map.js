'use strict';

angular.module('uGisFrontApp')
  .controller('MapViewCtrl', ['$scope', '$routeParams', 'ngDialog', 'MapService',
  	function ($scope, $routeParams, ngDialog, MapService) {
     
      var mapId = $routeParams.id;
      MapService.get({id: mapId},
          function success(response){
            $scope.map = response;
            console.log('Success:' + JSON.stringify(response));
          },
          function error(errorResponse){
            console.log('Error:' + JSON.stringify(errorResponse));
          }
        );

       $scope.clickToOpen = function () {
        ngDialog.open({ template: 'index_ng-flow.html'});
       };

  }]);
// var mapapp = angular.module('uGisFrontApp', ['ngMaterial'])

// mapapp.controller('MapViewCtrl',
//     function ($scope, $routeParams, $mdDialog, MapService) {
     
//       var mapId = $routeParams.id;
//       MapService.get({id: mapId},
//           function success(response){
//             $scope.map = response;
//             console.log("Success:" + JSON.stringify(response));
//           },
//           function error(errorResponse){
//             console.log("Error:" + JSON.stringify(errorResponse));
//           }
//         );

//        $scope.showAlert = function(ev) {
//     // Appending dialog to document.body to cover sidenav in docs app
//     // Modal dialogs should fully cover application
//     // to prevent interaction outside of dialog
//       $mdDialog.show(
//       $mdDialog.alert()
//         .parent(angular.element(document.querySelector('#popupContainer')))
//         .clickOutsideToClose(true)
//         .title('This is an alert title')
//         .textContent('You can specify some description text in here.')
//         .ariaLabel('Alert Dialog Demo')
//         .ok('Got it!')
//         .targetEvent(ev)
//     );
//   };

//   });
