'use strict';

angular.module('uGisFrontApp')
  .controller('MapViewCtrl', ['$scope', '$window', '$location', '$routeParams',
   'ngDialog', 'MapService', 'LayerListService', 'LayerImageListService', 'LayerStartProcess',
   'SelectFilesServices',
  	function ($scope, $window, $location, $routeParams, 
      ngDialog, MapService, LayerListService, LayerImageListService, LayerStartProcess, SelectFilesServices) {
      $scope.isWaitProcess = false;
      $scope.isUploadEnable = false;

      $scope.uploadBtnTxt = 'Select images for analysis';
      var mapId = $routeParams.id;

      var map = $window.L.map('mapid').setView([40.1965679722222, 116.167953], 15);
      $scope.MapModel = {
                map: map,
                // basemaps: basemaps,
                // layers: layers,
                //zoom: 13
            };

      var baselayer = $window.L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
        maxZoom: 30,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.satellite'
      }).addTo(map);

      

         $scope.clickToOpen = function () {
          ngDialog.open({ template: 'index_ng-flow.html'});
         };


        $scope.uploadOnClick = function(){
            var mapStatus = $scope.map.status;
            //等待上传图片信息进行覆盖分析状态
            if($scope.isUploadEnable == false){
              var uploadpath = '/upload/' + mapId;
              $location.path(uploadpath);
              //_addNewLayer();
               
            }
            //分析完毕准备上传图片状态
            else{ 
              //开始上传
                //_addNewLayer();
                var flowObj = SelectFilesServices.getFlow();
                flowObj.upload();
            }
            
        };

        $scope.loadLayerUploadImageInfo = function(layer){
           $scope.currentViewLayer = layer;

           if(layer.maplayerimages.length > 0){
              $scope.currentViewLayerWMSName = layer.maplayerimages[0].layer_wms_path;
              _loadWMSLayer($scope.currentViewLayerWMSName);
           }
           else
              $scope.currentViewLayerWMSName = '';


           LayerImageListService.query({mapid: $scope.map.id, layerid: layer.id},
            function success(response){
                $scope.images = response;
                console.log('Success:' + JSON.stringify(response));    
                //Draw circle
                //_drawImageCircle();
                     
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });

           
           
          };

        $scope.startProcess = function(){
          LayerStartProcess.post({mapid: $scope.map.id, layerid: $scope.currentViewLayer.id},
            function success(response){
                
                console.log('Success:' + JSON.stringify(response));     
                _getMap();          
                     
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
        }

        $scope.uploadComplete = function(){
            //TODO 上传完毕,创建图层、导入图片到databse、开始生成模型（三步一体）
            _addNewLayer();
        }
        
        var _loadWMSLayer  = function(layerName){
          var wmsLayer = $window.L.tileLayer.wms('http://192.168.66.136:8080/geoserver/wsgeotiff/wms?', {
                  layers: layerName,
                  format: 'image/png',
                  transparent: true,
                  maxZoom: 30
                  }).addTo(map);
        };

        var _addNewLayer = function(){
          var mapStatus = $scope.map.status;

          LayerListService.post({mapid: $scope.map.id, stack_order:1},
            function success(response){
                $scope.currentViewLayer = response;
                console.log('Success:' + JSON.stringify(response));
                //创建图层成功后开始处理图片
                $scope.startProcess();
        
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
          };
        
        var _getMap = function(){
           MapService.get({id: mapId},
              function success(response){
                $scope.map = response;
                $scope.layers = response.layer_set;
                if($scope.layers.length > 0){
                    $scope.loadLayerUploadImageInfo($scope.layers[0]);

                }
                console.log('Success:' + JSON.stringify(response));
                //_jugeMapStatus();
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
        }
        
       // var _drawImageCircle = function(){
       //    if($scope.images.length>0){
       //      map.panTo({lat:$scope.images[0].lat, lng: $scope.images[0].lon});
       //    }

       //    for (var i = $scope.images.length - 1; i >= 0; i--) {
       //       var lat = $scope.images[i].lat;
       //       var lon = $scope.images[i].lon;
       //       $window.L.circle([lat, lon], 10, {
       //            color: 'red',
       //            fillColor: '#f03',
       //            fillOpacity: 0.1
       //          }).addTo(map).bindPopup($scope.currentViewLayer.upload_time);  
       //    }
       // };

       _getMap();

       var selFilesInfo = SelectFilesServices.getFilesInfo();
       if(selFilesInfo.length>0){
          $scope.flowObj = SelectFilesServices.getFlow();
          $scope.isUploadEnable = true;
          $scope.uploadBtnTxt = 'Finish';
          //Set map center
          map.panTo({lat: selFilesInfo[0].lat, lng: selFilesInfo[0].lon});
       }
       else if(selFilesInfo.length==0){
          $scope.isUploadEnable = false;
          $scope.uploadBtnTxt = 'Select images for analysis';
       }
       for (var i = selFilesInfo.length - 1; i >= 0; i--) {

             var lat = selFilesInfo[i].lat;
             var lon = selFilesInfo[i].lon;
             $window.L.circle([lat, lon], 10, {
                  color: 'red',
                  fillColor: '#f03',
                  fillOpacity: 0.1
                }).addTo(map).bindPopup(selFilesInfo[i].ImageDescription);  
       }

  }]);

