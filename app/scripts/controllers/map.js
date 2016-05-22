'use strict';

angular.module('uGisFrontApp')
  .controller('MapViewCtrl', ['$scope', '$window', '$location', '$routeParams',
   'ngDialog', 'MapService', 'LayerListService', 'LayerImageListService', 'LayerStartProcess',
  	function ($scope, $window, $location, $routeParams, 
      ngDialog, MapService, LayerListService, LayerImageListService, LayerStartProcess) {
      $scope.isWaitProcess = false;
      $scope.isUploadEnable = false;
      $scope.uploadBtnTxt = 'Add New Layer';
      var mapId = $routeParams.id;

      var map = $window.L.map('mapid').setView([0, 0], 18);
      $scope.MapModel = {
                map: map,
                // basemaps: basemaps,
                // layers: layers,
                //zoom: 13
            };

      var baselayer = $window.L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
        maxZoom: 18,
        // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        //   '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        //   'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.satellite'
      }).addTo(map);

      

      

         $scope.clickToOpen = function () {
          ngDialog.open({ template: 'index_ng-flow.html'});
         };


        $scope.uploadOnClick = function(){
            var mapStatus = $scope.map.status;
            //等待处理状态
            if(mapStatus == 'N'){
               _updateLayerUploadImage();
            }
            //初始状态和已经处理完状态
            else if(mapStatus == 'D'){ 
                _addNewLayer();
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
                _drawImageCircle();
                     
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
                $scope.newLayer = response;
                console.log('Success:' + JSON.stringify(response));
                //route to upload image page.
                var uploadpath = '/upload/' + $scope.newLayer.map + '/' + $scope.newLayer.id;
                $location.path(uploadpath);
            
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
          };

        var _updateLayerUploadImage = function(){
            //TODO
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
                _jugeMapStatus();
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
        }
        var _jugeMapStatus = function(){
          var mapStatus = $scope.map.status;
          //等待处理状态
          if(mapStatus == 'N'){
              $scope.isWaitProcess = true;
              $scope.isUploadEnable = true;
              $scope.uploadBtnTxt = 'Update Layer images';
          }
          //初始状态和已经处理完状态
          else if(mapStatus == 'D'){ 
              $scope.isWaitProcess = false;
              $scope.isUploadEnable = true;
              $scope.uploadBtnTxt = 'Add New Layer';
          }
          else if(mapStatus == 'P'){ 
              $scope.isWaitProcess = false;
              $scope.isUploadEnable = false;
          }
       };


       var _drawImageCircle = function(){
          if($scope.images.length>0){
            map.panTo({lat:$scope.images[0].lat, lng: $scope.images[0].lon});
          }

          for (var i = $scope.images.length - 1; i >= 0; i--) {
             var lat = $scope.images[i].lat;
             var lon = $scope.images[i].lon;
             $window.L.circle([lat, lon], 10, {
                  color: 'red',
                  fillColor: '#f03',
                  fillOpacity: 0.1
                }).addTo(map).bindPopup($scope.currentViewLayer.upload_time);  
          }
       };

       _getMap();

  }]);

