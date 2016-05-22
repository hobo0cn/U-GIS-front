'use strict';

angular.module('uGisFrontApp')
.config(['flowFactoryProvider', function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    target: 'http://192.168.66.136:3000/upload/',
    permanentErrors: [404, 500, 501],
    chunkRetryInterval: 5000,
    testChunks:false,
    chunkSize: 9007199254740992,
    maxChunkRetries: 1,
    simultaneousUploads: 4,
  };
  flowFactoryProvider.on('catchAll', function (event) {
    console.log('catchAll', arguments);
  });
  // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);


angular
    .module('uGisFrontApp')
    .controller('UploadController', ['$scope',  '$location', '$routeParams', 'LayerStartAnalysis',
        function($scope, $location, $routeParams, LayerStartAnalysis) {
          var layerId = $routeParams.layerid;
          $scope.mapid = $routeParams.mapid;
          $scope.layerid = $routeParams.layerid;
          $scope.config= {
            //TODO rerquest current map id
            query: {
                      project_id: layerId, 
                   }
          };


        $scope.startAnalysis = function(){
           //TODO start analysis image process
           LayerStartAnalysis.post({mapid: $scope.mapid, layerid: $scope.layerid},
              function success(response){
                console.log('Success:' + JSON.stringify(response));
                //route to upload image page.
                var mappath = '/map/' + $scope.mapid;
                $location.path(mappath);
            
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              });

        };

    }]);
