
'use strict';
angular.module('uGisFrontApp')
  .controller('OwnerProjectCtrl', 
    ['$scope', '$location', '$cookies', '$window', '$routeParams', 'MapService', 
   function ($scope, $location, $cookies, $window, $routeParams, MapService) {
      var mapId = $routeParams.projectid;

      var _getOwneProject = function(){
          
           MapService.get({id: mapId},
              function success(response){
                $scope.map = response;
                map.panTo({lat: $scope.map.center_x, lng: $scope.map.center_y});
                _loadResultLayers();
                console.log('Success:' + JSON.stringify(response));

              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
        
        };

        var _loadWMSLayer  = function(layerName){
          var wmsLayer = $window.L.tileLayer.wms('http://192.168.66.146:8080/geoserver/wsgeotiff/wms?', {
                  layers: layerName,
                  format: 'image/png',
                  transparent: true,
                  crs: $window.L.CRS.GCJ02,
                  maxZoom: 30
                  }).addTo(map);
        };

        //加载当前项目所有可用任务结果
        var _loadResultLayers  = function(){

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


        _getOwneProject();

        var map = $window.L.map('mapid').setView([51.2, 7], 15);

        $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 30,
        
        }).addTo(map);



        var sidebar = $window.L.control.sidebar('sidebar', {
            closeButton: false,
            position: 'left',
            autoPan: true
        });
        map.addControl(sidebar);
        sidebar.show();

         $(window).on("resize", function() {
          $("#mapid").height($(window).height())
                .width($(window).width());
          
          map.invalidateSize();
      }).trigger("resize");


  }]);
