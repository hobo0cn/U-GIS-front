'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:ShareCtrl
 * @description
 * # ShareCtrl
 * Controller of the uGisFrontApp Share View
 */
angular.module('uGisFrontApp')
  .controller('ShareCtrl',
  ['$scope', '$location', '$cookies', '$window', '$routeParams', 'MapService',
  'MapShareService', 'MapShareRequestService', 'ngDialog',
  function ($scope, $location, $cookies, $window, $routeParams, MapService,
  MapShareService, MapShareRequestService, ngDialog) {
    // var mapid = $routeParams.mapid;
    var token = $routeParams.token;
    // $scope.projectId = mapId;

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

    var annotationStyle = {
      fillColor: "#13bde7",
      color: "#13bde7",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.001
    };

    var _getIdFromToken = function() {
      MapShareRequestService.get({token: token},
        function success(response){
          console.log('Success:' + JSON.stringify(response));
          //按照返回id访问获取共享信息URL
          $scope.mapId = response.mapid;
          $scope.shareId = response.shareid;
        },
        function error(errorResponse){
          console.log('Error:' + JSON.stringify(errorResponse));
        }
      );
    };

    $scope.getMapShare = function(inputpwd) {
      MapShareService.get({mapid: $scope.mapId,
                           shareid: $scope.shareId,
                           password: inputpwd},
        function success(response){
          $scope.intputpwdDlg.close();
          console.log('Success:' + JSON.stringify(response));

          $scope.map = response.map_obj;
          //默认加载正射影像图
          // $scope.reports = response.report_set;
          _loadResultLayers("Orthphoto");
          //绘制项目范围geojson
          $scope.area_geojson  = JSON.parse($scope.map.area );
          $window.L.geoJson($scope.area_geojson, {
            style: geojsonStyle
          }).addTo(map);
          map.panTo({lat: $scope.map.center_x, lng: $scope.map.center_y});

          // 加载标注
          _loadAnnotation($scope.map.anno_set);
        },
        function error(errorResponse){
          console.log('Error:' + JSON.stringify(errorResponse));
          $scope.isPasswordError = true;

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

      var _loadAnnotation = function(annoSet){
          //加载标注
          for (var i = 0; i < annoSet.length; i++) {
            var parsedGeoJson = JSON.parse(annoSet[i].geojson);
            var feature = new $window.L.geoJson(parsedGeoJson, {
              style: annotationStyle
            });
            feature.options.dbid = annoSet[i].id;
            map.addLayer(feature);
            var editFeatureId = feature._leaflet_id-1;
            map._layers[editFeatureId].options.dbid = annoSet[i].id;
            map._layers[editFeatureId].options.dbtitle = annoSet[i].title;
            map._layers[editFeatureId].options.dbcomms = annoSet[i].comment_set;
            // _addEditFeatureOnCallback(feature);
            // _addEditFeatureOnCallback(map._layers[editFeatureId]);
          }
      };

      var _showPwdDialog = function() {
          $scope.intputpwdDlg = ngDialog.open({ template: '../views/inputpasswordDlg.html',
                          className: 'ngdialog-theme-default',
                          scope: $scope,
                          isPasswordError: false,
                          controller: ['$scope',
                              function($scope) {
                              // controller logic
                              $scope.password = "";
                              // $scope.isPasswordError = false;
                          }]
                        });
      };


      var map = $window.L.map('mapid',{zoomControl: false}).setView([39.58, 116.38], 15);
      map.addControl(new $window.L.control.zoom({position: 'bottomright',zoomInText:'',zoomOutText:''}));
     $window.L.tileLayer('http://map.yiyuntu.cn:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 30,

      }).addTo(map);
     $scope.mapCtrl = map;
     //先已token获取对应共享地图的mapid和shareid
     _getIdFromToken();
     //TODO 对话框让用户输入密码
     _showPwdDialog();

  }]);
