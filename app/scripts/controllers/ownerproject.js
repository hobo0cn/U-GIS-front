
'use strict';
angular.module('uGisFrontApp')
  .controller('OwnerProjectCtrl',
    ['$scope', '$location', '$cookies', '$window', '$routeParams', 'MapService',
    'AnnotationListService', 'AnnotationService','AnnotationCommentService',
   function ($scope, $location, $cookies, $window, $routeParams, MapService,
     AnnotationListService, AnnotationService, AnnotationCommentService) {
      var mapId = $routeParams.projectid;
      $scope.projectId = mapId;
      $scope.username = $cookies.get('EDM_username');
      $scope.usercat =  $cookies.get('EDM_usercat');
      var panelType=0;

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

      var annotationStyle = {
        fillColor: "#13bde7",
        color: "#13bde7",
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
            else if($scope.usercat == 'A'){
              return "项目管理";
            }
        };

        $scope.getSecondNviPath = function () {
            if ($scope.usercat == "O") {
                return  "#/dashboard";
            }
            else if ($scope.usercat == 'S'){
                return  "#/datadashboard";
            }
            else if($scope.usercat == 'A'){
              return  "#/project";
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

                // 加载标注
                _loadAnnotation($scope.map.anno_set);
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

        var _getAnnotation = function() {
          AnnotationService.get(
          {
                mapid: $scope.projectId,
                annotationid: editingFeature.options.dbid,
          },
          function success(response){
              console.log('Success:' + JSON.stringify(response));
              $scope.annoComms = response.comment_set;
              editingFeature.options.dbcomms = response.comment_set;
          },
          function error(errorResponse){
              console.log('Error:' + JSON.stringify(errorResponse));
          });
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
              _addEditFeatureOnCallback(feature);
              _addEditFeatureOnCallback(map._layers[editFeatureId]);
            }
        };

        //显示图元编辑面板
        var isShowFeaturePanel = false;
        var panelType = 0; //1-点  2-线  3-面  0-不显示
        $scope.markerPos = "0.0, 0.0";
        $scope.polylineLen = "";
        $scope.polygonArea = "";

        var _round = function(num, len) {
                   return Math.round(num*(Math.pow(10, len)))/(Math.pow(10, len));
               };
        var strLatLng = function(latlng) {
            return "("+_round(latlng.lat, 6)+", "+_round(latlng.lng, 6)+")";
        };

        var _showFeaturePanel = function(targetFeature){

            if (targetFeature instanceof L.Polygon) {
                panelType = 3;
               //获取面积数值
               var latlngs = targetFeature._defaultShape ? targetFeature._defaultShape() : targetFeature.getLatLngs(),
                    area = L.GeometryUtil.geodesicArea(latlngs);
                $scope.polygonArea =  "面积: "+L.GeometryUtil.readableArea(area, true);
            }
            else if (targetFeature instanceof L.Polyline) {
                panelType = 2;
                //获取线长度
                var latlngs = targetFeature._defaultShape ? targetFeature._defaultShape() : targetFeature.getLatLngs(),
                    distance = 0;
                if (latlngs.length < 2) {
                    $scope.polylineLen = "距离: N/A";
                } else {
                    for (var i = 0; i < latlngs.length-1; i++) {
                        distance += latlngs[i].distanceTo(latlngs[i+1]);
                    }
                    $scope.polylineLen = "距离: "+_round(distance, 2)+" 米";
                }
            }
            else if (targetFeature instanceof L.Marker) {
                panelType = 1;
               //获取位置点经纬度
               $scope.markerPos = strLatLng(targetFeature.getLatLng());

            }
            // console.log(panelType);
            return panelType;
        };

        var _createAnnotation = function(categroy, geojson, feature) {
          //TODO 需要计算创建图元API参数所需的measure_str
          AnnotationListService.post(
          {
                mapid: $scope.projectId,
                categroy: categroy,
                // title: title,
                geojson: geojson ,
                // measure_str: measure_str,
          },
          function success(response){
              console.log('Success:' + JSON.stringify(response));
              feature.options.dbid = response.id;
          },
          function error(errorResponse){
              console.log('Error:' + JSON.stringify(errorResponse));
          });

        };

        var _updateAnnotation = function(annotationid, geojson) {
          AnnotationService.update(
          {
                mapid: $scope.projectId,
                annotationid: annotationid,
                geojson: geojson
          },
          function success(response){
              console.log('Success:' + JSON.stringify(response));
          },
          function error(errorResponse){
              console.log('Error:' + JSON.stringify(errorResponse));
          });
        };

        $scope.updateAnnotationTitle = function() {
          var annotationid = editingFeature.options.dbid;
          editingFeature.options.dbtitle = $scope.annotationTitle;
          AnnotationService.update(
          {
                mapid: $scope.projectId,
                annotationid: annotationid,
                title: $scope.annotationTitle
          },
          function success(response){
              console.log('Success:' + JSON.stringify(response));
          },
          function error(errorResponse){
              console.log('Error:' + JSON.stringify(errorResponse));
          });
        };

        var _delAnnotation = function() {
          var annotationid = editingFeature.options.dbid;
          AnnotationService.delete(
          {
                mapid: $scope.projectId,
                annotationid: annotationid,
          },
          function success(response){
              console.log('Success:' + JSON.stringify(response));
              //从地图上删除图元
              map.removeLayer(editingFeature);
              editingFeature = null;
          },
          function error(errorResponse){
              console.log('Error:' + JSON.stringify(errorResponse));
          });
        };

        $scope.onNewCommentAcceptClick = function() {
          //保存新的备注
          AnnotationCommentService.post(
          {
                mapid: $scope.projectId,
                annotationid: editingFeature.options.dbid,
                comment: $scope.newComment
          },
          function success(response){
              console.log('Success:' + JSON.stringify(response));
              $scope.newComment = "";
              _getAnnotation();

          },
          function error(errorResponse){
              console.log('Error:' + JSON.stringify(errorResponse));
          });
        };

        $scope.isShowMarkerPanel = function() {
            if (panelType == 1) {
              return true;
            }
            return false;
        };

        $scope.isShowPolylinePanel = function() {
            if (panelType == 2) {
              return true;
            }
            return false;
        };

        $scope.isShowPolygonPanel = function() {
            if (panelType == 3) {
              return true;
            }
            return false;
        };
        $scope.isShowDelButton = function() {
            if (panelType != 0) {
              return true;
            }
            return false;
        };
        $scope.onDelFeatureClick = function() {
          //删除图元
          //调用删除标注API
          _delAnnotation();
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

        $scope.startDrawMarker = function() {
            //画Marker
            $scope.marker = new $window.L.Draw.Marker($scope.mapCtrl, $scope.drawControl.options);
            $scope.marker.enable();
        };

        $scope.startDrawPolyline = function() {
            //画线
            $scope.polyline = new $window.L.Draw.Polyline($scope.mapCtrl, $scope.drawControl.options);
            $scope.polyline.enable();
        };

        $scope.startDrawPolygon = function() {
            //画多边形
            $scope.polygon = new $window.L.Draw.Polygon($scope.mapCtrl, $scope.drawControl.options);
            $scope.polygon.enable();
        };

        var _addEditFeatureOnCallback = function (feature) {
          feature.on({
              'mouseover': function (e) {
                  // highlight(e.target);
              },
              'moveend': function (e) {
                  // dehighlight(e.target);
                  var target = e.target;
                  //触发侧边栏点（位置）、线（长度）、面（面积）测量显示，并且显示删除按键
                  $scope.$apply(_showFeaturePanel(target));
                  // 编辑图元，调用更新API
                  var anno_geojson = JSON.stringify(target.toGeoJSON());
                  _updateAnnotation(target.options.dbid, anno_geojson);
              },
              'click': function (e) {
                // layer.editing.enable();
                if (editingFeature) {
                  editingFeature.editing.disable();
                  $scope.annotationTitle = "";
                  $scope.annoComms = [];
                }
                // var target = e.target;
                var target = e.layer;
                if (!target) {
                  target = e.target;
                }
                target.editing.enable();
                editingFeature = target;
                $scope.annotationTitle = editingFeature.options.dbtitle;
                $scope.annoComms = editingFeature.options.dbcomms;
                // 触发侧边栏点（位置）、线（长度）、面（面积）测量显示，并且显示删除按键
                $scope.$apply(_showFeaturePanel(target));
              }
          });

        };


        _getOwneProject();

        var map = $window.L.map('mapid',{zoomControl: false}).setView([39.58, 116.38], 15);
        map.addControl(new $window.L.control.zoom({position: 'bottomright',zoomInText:'',zoomOutText:''}));
       $window.L.tileLayer('http://60.205.127.41:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 30,

        }).addTo(map);
       $scope.mapCtrl = map;


       // Initialise the FeatureGroup to store editable layers
        var drawnItems = new $window.L.FeatureGroup();
        map.addLayer(drawnItems);

        // Initialise the draw control and pass it the FeatureGroup of editable layers
        $scope.drawControl = new $window.L.Control.Draw({
            draw: {
              polyline: false,
              marker: false,
              rectangle: false,
              circle: false,
              polygon: false
            },
            edit: {
                featureGroup: drawnItems,
                remove: true
            }
        });
        map.addControl($scope.drawControl);

        var feature_list = [];
        var editingFeature = null;
        var editingFeatureLayer = null;

        map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;
            var anno_cat = "";
            var anno_geojson = "";
            if (type == 'marker') {
              $scope.marker.disable();
              anno_cat = "Marker";
            }
            if (type == 'polyline') {
              $scope.polyline.disable();
              anno_cat = "Polyline";
            }
            if (type == 'polygon') {
               $scope.polygon.disable();
               anno_cat = "Polygon";
            }

            // Do whatever you want with the layer.
            // e.type will be the type of layer that has been draw (polyline, marker, polygon, rectangle, circle)
            // E.g. add it to the map

            // 创建时图元时，调用API保存图元
            anno_geojson = JSON.stringify(layer.toGeoJSON());
            _createAnnotation(anno_cat, anno_geojson, layer);

            layer.addTo(map);
            _addEditFeatureOnCallback(layer);
            feature_list.push(layer);
        });

         map.on('click', function (e) {
            // var type = e.layerType,
            //     layer = e.layer;


            // Do whatever you want with the layer.
            // e.type will be the type of layer that has been draw (polyline, marker, polygon, rectangle, circle)
            // E.g. add it to the map

        });

        map.on('draw:editvertex', function (e) {
           var type = e.layerType,
               layer = e.layer;

           var target = e.poly;

           $scope.$apply(_showFeaturePanel(target));

           //编辑图元，调用更新API
           var anno_geojson = JSON.stringify(target.toGeoJSON());
           _updateAnnotation(target.options.dbid, anno_geojson);
       });


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
        // $window.L.control.coordinates({
        //     position:"bottomleft", //optional default "bootomright"
        //     decimals:5, //optional default 4
        //     decimalSeperator:".", //optional default "."
        //     labelTemplateLat:"纬度: {y}", //optional default "Lat: {y}"
        //     labelTemplateLng:"经度: {x}", //optional default "Lng: {x}"
        //     enableUserInput: false, //optional default true
        //     useDMS:true, //optional default false
        //     useLatLngOrder: true, //ordering of labels, default false-> lng-lat
        //     markerType: L.marker, //optional default L.marker
        //     markerProps: {}, //optional default {},
        //     // labelFormatterLng : funtion(lng){return lng+" lng"}, //optional default none,
        //     // labelFormatterLat : funtion(lat){return lat+" lat"}, //optional default none
        //      customLabelFcn: function(latLonObj, opts) { "Geohash: " + encodeGeoHash(latLonObj.lat, latLonObj.lng)} //optional default none
        // }).addTo(map);




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
