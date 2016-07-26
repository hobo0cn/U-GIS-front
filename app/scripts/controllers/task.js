'use strict';


angular.module('uGisFrontApp')
.config(['flowFactoryProvider', 
  function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    
    target: 'http://192.168.66.145:3000/upload/',
    //target: 'http://112.74.189.43:3000/upload/',
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
  flowFactoryProvider.on('complete', function (event) {
    // SelectFilesServices.uploadComplete();
    console.log('test', arguments);
  });
  // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);
/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('TaskCtrl', ['$scope', '$window', '$location', '$routeParams', 
    'ngDialog', '$cookies', 'LayerService', 
    'MapService', 'SelectFilesServices',
  	function ($scope, $window, $location, $routeParams, 
      ngDialog, $cookies, LayerService, 
      MapService, SelectFilesServices) {
     
     var mapId = $routeParams.projectid;
     var layerId = $routeParams.taskid;

     $scope.config= {
            //TODO rerquest current map id
            query: {
                      project_id: mapId, 
                      task_id: layerId
                   }
          };

     $scope.imageNum = 0;
     var _getProjectArea = function(){
           MapService.get({id: mapId},
              function success(response){
                $scope.map = response;
                //map.setView([$scope.map.center_x, $scope.map.center_y], 15);
                //$scope.area_geojson = JSON.stringify(eval("(" + response.area + ")"));
                $scope.area_geojson  = JSON.parse(response.area );
                console.log('Success:' + JSON.stringify(response));

                $window.L.geoJson($scope.area_geojson).addTo(map);
                //_jugeMapStatus();
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
        }

        var _getTask = function() {
          
          LayerService.get(
             {
              mapid: mapId,
              layerid: layerId 
            }, 
            function success(response){
               $scope.task = response;
               console.log('Success:' + JSON.stringify(response));
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
        };
        _getTask();
     
      
        var map = $window.L.map('mapid').setView([51.2, 7], 9);


        $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 30,
        
        }).addTo(map);



        var sidebar = $window.L.control.sidebar('sidebar', {
            // closeButton: true,
            position: 'left'
        });
        map.addControl(sidebar);
        sidebar.show();
        
         var selFilesInfo = SelectFilesServices.getFilesInfo();
         if(selFilesInfo.length>0){
            $scope.flowObj = SelectFilesServices.getFlow();
            $scope.imageNum = selFilesInfo.length;
            
            //Set map center
            map.panTo({lat: selFilesInfo[0].lat, lng: selFilesInfo[0].lon});
         }
         // else if(selFilesInfo.length==0){
         //    $scope.isUploadEnable = false;
         //    $scope.uploadBtnTxt = 'Select images for analysis';
         // }
         for (var i = selFilesInfo.length - 1; i >= 0; i--) {

               var lat = selFilesInfo[i].lat;
               var lon = selFilesInfo[i].lon;
               $window.L.circle([lat, lon], 10, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.1
                  }).addTo(map).bindPopup(selFilesInfo[i].ImageDescription);  
         }


        $(window).on("resize", function() {
          $("#mapid").height($(window).height())
                .width($(window).width());
          
          map.invalidateSize();
      }).trigger("resize");

        
      $scope.uploadComplete = function() {
         //上传图片完成后，设置任务状态到FD
         LayerService.update({mapid: mapId, layerid: layerId, status: 'FD', 
                              map: mapId, stack_order: 1},
              function success(response){
                console.log('Success:' + JSON.stringify(response));
                _getTask();

              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
      };
      
      $scope.uploadProcessImageComplete = function() {
         //上传图片完成后，设置任务状态到D
         LayerService.update({mapid: mapId, layerid: layerId, status: 'D', 
                              map: mapId, stack_order: 1},
              function success(response){
                console.log('Success:' + JSON.stringify(response));
                _getTask();

              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
      };
      $scope.uploadOnClick = function(){
                //打开进度条对话框,并开始上传
                ngDialog.open({
                template: '../views/uploadDlg.html',
                closeByDocument: false,
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller: ['$scope', 'SelectFilesServices', 
                    function($scope, SelectFilesServices) {
                    // controller logic
                    $scope.flowObj = SelectFilesServices.getFlow();
                    $scope.flowObj.upload();

                }]
            });
        };

      $scope.isShowUploadProcessImage = function() {
          if ($scope.task==null) return false;
          if ($scope.task.status == 'P') {
            return true;
          }
          return false;
      };

      $scope.isShowUploadPhoto = function() {
          if ($scope.task==null) return false;
          if ($scope.task.status == 'FI') {
            return true;
          }
          return false;
      };

  }]);
