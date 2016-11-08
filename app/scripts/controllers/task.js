'use strict';


angular.module('uGisFrontApp')
.config(['flowFactoryProvider', 
  function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    
    //target: 'http://192.168.66.146:3000/upload/',
    target: 'http://112.74.189.43:3000/upload/',
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
    'MapService', 'SelectFilesServices', 'LayerUploadOrthphoto', 'LayerUploadImageDone',
  	function ($scope, $window, $location, $routeParams, 
      ngDialog, $cookies, LayerService, 
      MapService, SelectFilesServices, LayerUploadOrthphoto, LayerUploadImageDone) {
     
     var mapId = $routeParams.projectid;
     var layerId = $routeParams.taskid;

     $scope.projectid = mapId;
     $scope.taskid = layerId;

     $scope.isSelectFile = false;

     $scope.config= {
            //TODO rerquest current map id
            query: {
                      project_id: mapId, 
                      task_id: layerId
                   }
          };

     $scope.imageNum = 0;
     var _getMapInfo = function(){
           MapService.get({id: mapId},
              function success(response){
                $scope.map = response;
                if (!$scope.isSelectFile) {
                  map.panTo({lat: $scope.map.center_x, lng: $scope.map.center_y});
                }
                
                _loadWMSLayers();
                console.log('Success:' + JSON.stringify(response));

                
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
               //加载当前任务范围geojson
               $scope.area_geojson  = JSON.parse(response.area);
               $window.L.geoJson($scope.area_geojson).addTo(map);

               //获取上传的图片文件列表
               $scope.upload_images = $scope.task.upload_image_set;
               console.log('Success:' + JSON.stringify(response));
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
        };

        var _loadWMSLayer  = function(layerName){
          var wmsLayer = $window.L.tileLayer.wms('http://112.74.189.43:8080/geoserver/wsgeotiff/wms?', {
                  layers: layerName,
                  format: 'image/png',
                  transparent: true,
                  crs: $window.L.CRS.GCJ02,
                  maxZoom: 30
                  }).addTo(map);
        };

        //加载当前项目所有可用任务结果
        var _loadWMSLayers  = function(){

          for (var i = $scope.map.layer_set.length - 1; i >= 0; i--) {
            var maplayerimages = $scope.map.layer_set[i].maplayerimages;
            //加载任务结果栅格数据
            if(maplayerimages.length > 0){
              $scope.currentViewLayerWMSName = maplayerimages[0].layer_wms_path;
              _loadWMSLayer(maplayerimages[0].layer_wms_path);
            }
            //加载任务范围矢量数据？

          }
          
        };
        
        
      
        var map = $window.L.map('mapid').setView([51.2, 7], 12);
        _getMapInfo();
        _getTask();
        

        $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 30,
        
        }).addTo(map);



        var sidebar = $window.L.control.sidebar('sidebar', {
            closeButton: false,
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
            $scope.isSelectFile = true;
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
          //等待上传图片计数清零
          $scope.imageNum = 0;
          //启动后台图片处理任务
          LayerUploadImageDone.post({mapid: mapId, layerid: layerId},
              function success(response){
                console.log('Success:' + JSON.stringify(response));
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );

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
      
      // $scope.uploadProcessImageComplete = function(map_format) {
      //    //上传处理的geotiff文件后，通知后台进行处理，由后台把任务状态修改为‘D’
      //     LayerUploadOrthphoto.post({mapid: mapId, layerid: layerId, 
      //                               geotiff_file_name: 'odm_orthophoto.tif', 
      //                               format: map_format
      //                         },
      //         function success(response){
      //           console.log('Success:' + JSON.stringify(response));
      //         },
      //         function error(errorResponse){
      //           console.log('Error:' + JSON.stringify(errorResponse));
      //         }
      //       );
      // };
      $scope.uploadOnClick = function(){
                if ($scope.imageNum == 0){
                  return;
                }
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

      $scope.uploadPhoto = function (projectid, taskid) {
         var uploadpath = '/upload/' + projectid + '/' + taskid;
         $location.path(uploadpath); 
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
