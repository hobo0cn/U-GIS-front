
'use strict';
angular.module('uGisFrontApp')
  .controller('OwnerProjectCtrl', 
    ['$scope', '$location', '$cookies', '$window', '$routeParams', 'MapService', 
   function ($scope, $location, $cookies, $window, $routeParams, MapService) {
      var mapId = $routeParams.projectid;
      $scope.projectId = mapId;
      $scope.username = $cookies.get('EDM_username');
      $scope.usercat =  $cookies.get('EDM_usercat');

      //TEST DATA
      $scope.reports = [];
      
      if ($scope.username == null) {
        $location.path("#/login")
      }
      var loadedLayerGroup = [];
      // var loadedLayerGroup_1 = $window.L.layerGroup();
      var geojsonStyle = {
          // "color": "#ff7800",
          // "weight": 5,
          // "opacity": 0.01

    fillColor: "#ff7800",
    color: "#ff7800",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.001
      };


      $scope.getSecondNviText = function () {
            if ($scope.usercat == "O") {
                return  "已完成项目";
            } 
            else if ($scope.usercat == 'S'){
                return  "数据管理任务";
            }
        };

        $scope.getSecondNviPath = function () {
            if ($scope.usercat == "O") {
                return  "#/dashboard";
            } 
            else if ($scope.usercat == 'S'){
                return  "#/datadashboard";
            }
        };


      var _getOwneProject = function(){
          
           MapService.get({id: mapId},
              function success(response){
                console.log('Success:' + JSON.stringify(response));

                $scope.map = response;
                //默认加载正射影像图
                $scope.reports = response.report_set;
                _loadResultLayers("Orthphoto");
                //绘制项目范围geojson
                $scope.area_geojson  = JSON.parse(response.area );
                $window.L.geoJson($scope.area_geojson, {
                  style: geojsonStyle
                }).addTo(map);
                map.panTo({lat: $scope.map.center_x, lng: $scope.map.center_y});
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

          // loadedLayerGroup_1.addLayer(wmsLayer).addTo(map);

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
          map.panTo({lat: $scope.map.center_x, lng: $scope.map.center_y});
        };


        
        _getOwneProject();

        var map = $window.L.map('mapid').setView([39.58, 116.38], 15);
       $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 30,
        
        }).addTo(map);

        // var hybird = $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
        //   maxZoom: 30,
        // });
        // var streets = $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaMap/MapServer/tile/{z}/{y}/{x}', {
        //   maxZoom: 30,
        // });
        // var terrain = $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaTerrainMap/MapServer/tile/{z}/{y}/{x}', {
        //   maxZoom: 30,
        // });

         // var map = $window.L.map('mapid', {
         //  center: [39.58, 116.38],
         //   zoom: 15,
         //   layers: [streets, hybird]
         // });

         // var baseMaps = {
         //      "街道图": streets,
         //      // "地形图": terrain,
         //      "混合图": hybird
         //  };


        // $window.L.control.layers(baseMaps).addTo(map);

        //鼠标位置经纬度显示
        $window.L.control.coordinates({
            position:"bottomleft", //optional default "bootomright"
            decimals:5, //optional default 4
            decimalSeperator:".", //optional default "."
            labelTemplateLat:"纬度: {y}", //optional default "Lat: {y}"
            labelTemplateLng:"经度: {x}", //optional default "Lng: {x}"
            enableUserInput: false, //optional default true
            useDMS:true, //optional default false
            useLatLngOrder: true, //ordering of labels, default false-> lng-lat
            markerType: L.marker, //optional default L.marker
            markerProps: {}, //optional default {},
            // labelFormatterLng : funtion(lng){return lng+" lng"}, //optional default none,
            // labelFormatterLat : funtion(lat){return lat+" lat"}, //optional default none
             customLabelFcn: function(latLonObj, opts) { "Geohash: " + encodeGeoHash(latLonObj.lat, latLonObj.lng)} //optional default none
        }).addTo(map);


       

        // $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
        //   maxZoom: 30,
        
        // }).addTo(map);



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
