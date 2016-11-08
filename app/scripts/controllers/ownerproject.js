
'use strict';
angular.module('uGisFrontApp')
  .controller('OwnerProjectCtrl', 
    ['$scope', '$location', '$cookies', '$window', '$routeParams', 'MapService', 
   function ($scope, $location, $cookies, $window, $routeParams, MapService) {
      var mapId = $routeParams.projectid;
      $scope.username = $cookies.get('EDM_username');

      //TEST DATA
      $scope.reports = [];
      
      if ($scope.username == null) {
        $location.path("#/login")
      }
      var loadedLayerGroup = [];

      var _getOwneProject = function(){
          
           MapService.get({id: mapId},
              function success(response){
                $scope.map = response;
                $scope.reports = response.report_set;
                map.panTo({lat: $scope.map.center_x, lng: $scope.map.center_y});
                _loadResultLayers("Orthphoto");
                console.log('Success:' + JSON.stringify(response));

              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
        
        };



        var _loadWMSLayer  = function(layerName){
          var wmsLayer = $window.L.tileLayer.wms('http://112.74.189.43:8080/geoserver/wsgeotiff/wms?', {
                  layers: layerName,
                  format: 'image/png',
                  transparent: true,
                  crs: $window.L.CRS.GCJ02,
                  maxZoom: 30
                  }).addTo(map);

          loadedLayerGroup.push(wmsLayer);
        };

        //加载当前项目所有可用任务结果
        var _loadResultLayers  = function(layer_format){

          for (var i = $scope.map.layer_set.length - 1; i >= 0; i--) {
            var maplayerimages = $scope.map.layer_set[i].maplayerimages;
            //加载任务结果栅格数据
            for (var i = maplayerimages.length - 1; i >= 0; i--) {
              if(maplayerimages[i].format == layer_format){
                _loadWMSLayer(maplayerimages[i].layer_wms_path);
              }
            }
            //加载任务范围矢量数据？

          }
          
        };
        //切换地图数据类型
        $scope.swtichLoadMap  = function(layer_format){
          //清除已经加载的层
          for (var i = loadedLayerGroup.length - 1; i >= 0; i--) {
            map.removeLayer(loadedLayerGroup[i]);
          }
          loadedLayerGroup = [];
          _loadResultLayers(layer_format);
        };


        _getOwneProject();

        var map = $window.L.map('mapid').setView([51.2, 7], 15);

        $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 30,
        
        }).addTo(map);



        // var sidebar = $window.L.control.sidebar('sidebar', {
        //     closeButton: false,
        //     position: 'left',
        //     autoPan: true
        // });
        // map.addControl(sidebar);
        // sidebar.show();

      //    $(window).on("resize", function() {
      //     $("#mapid").height($(window).height())
      //           .width($(window).width());
          
      //     map.invalidateSize();
      // }).trigger("resize");
      
   // $(window).on("resize", function() {
   //        $("#mapid").height($(window).height()-70)
   //              .width($(window).width()*83.33333333/100);
          
   //        map.invalidateSize();
   //    }).trigger("resize");

  }]);
