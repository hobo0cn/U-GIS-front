'use strict';


angular.module('uGisFrontApp')
  .directive('annotationPanel', ['$cookies', '$location', '$window',
    'AnnotationListService', 'AnnotationService','AnnotationCommentService',
    function($cookies, $location, $window,
            AnnotationListService, AnnotationService,AnnotationCommentService) {
    return {
      restrict: 'A',
      templateUrl: './views/annotationpanel.html',
      link: function(scope, element, attrs) {

        var annotationStyle = {
          fillColor: "#13bde7",
          color: "#13bde7",
          weight: 3,
          opacity: 1,
          fillOpacity: 0.001
        };

        var map = null;
        //显示图元编辑面板
        var isShowFeaturePanel = false;
        var panelType = 0; //1-点  2-线  3-面  0-不显示
        scope.markerPos = "0.0, 0.0";
        scope.polylineLen = "";
        scope.polygonArea = "";
        scope.drawControl = null;

        var feature_list = [];
        var editingFeature = null;
        var editingFeatureLayer = null;
        var drawnItems = null;

        //===========事件处理==================
         scope.$on('initDrawCtrlEvent', function(event, data){
            //初始化绘图插件
            var map = data;
            scope._initDrawCtrl(map);
         });

         scope.$on('loadAnnotationEvent', function(event, data){
            //加载标注
            _loadAnnotation(data);

         });
        //======================================

        scope._initDrawCtrl = function(_map) {
          // Initialise the FeatureGroup to store editable layers
           map = _map;
           drawnItems = new $window.L.FeatureGroup();
           map.addLayer(drawnItems);

           // Initialise the draw control and pass it the FeatureGroup of editable layers
           this.drawControl = new $window.L.Control.Draw({
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
           map.addControl(this.drawControl);

           map.on('draw:created', function (e) {
               var type = e.layerType,
                   layer = e.layer;
               var anno_cat = "";
               var anno_geojson = "";
               if (type == 'marker') {
                 scope.marker.disable();
                 anno_cat = "Marker";
               }
               if (type == 'polyline') {
                 scope.polyline.disable();
                 anno_cat = "Polyline";
               }
               if (type == 'polygon') {
                  scope.polygon.disable();
                  anno_cat = "Polygon";
               }

               // Do whatever you want with the layer.
               // e.type will be the type of layer that has been draw (polyline, marker, polygon, rectangle, circle)
               // E.g. add it to the map

               // 创建时图元时，调用API保存图元
               anno_geojson = JSON.stringify(layer.toGeoJSON());
               scope._createAnnotation(anno_cat, anno_geojson, layer);

               layer.addTo(map);
               _addEditFeatureOnCallback(layer);
               feature_list.push(layer);
           });

           map.on('draw:editvertex', function (e) {
              var type = e.layerType,
                  layer = e.layer;

              var target = e.poly;
              if(!target){
                target = e.target;
              }

              scope.$apply(scope._showFeaturePanel(target));

              //编辑图元，调用更新API
              var anno_geojson = JSON.stringify(target.toGeoJSON());
              scope._updateAnnotation(target.options.dbid, anno_geojson);
          });
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
                  scope.$apply(scope._showFeaturePanel(target));
                  // 编辑图元，调用更新API
                  var anno_geojson = JSON.stringify(target.toGeoJSON());
                  scope._updateAnnotation(target.options.dbid, anno_geojson);
              },
              'click': function (e) {
                // layer.editing.enable();
                if (editingFeature) {
                  editingFeature.editing.disable();
                  scope.annotationTitle = "";
                  scope.annoComms = [];
                }
                // var target = e.target;
                var target = e.layer;
                if (!target) {
                  target = e.target;
                }
                target.editing.enable();
                editingFeature = target;
                scope.annotationTitle = editingFeature.options.dbtitle;
                scope.annoComms = editingFeature.options.dbcomms;
                // 触发侧边栏点（位置）、线（长度）、面（面积）测量显示，并且显示删除按键
                scope.$apply(scope._showFeaturePanel(target));
              }
            });
          };

        var _getAnnotation = function() {
            AnnotationService.get(
            {
                  mapid: scope.projectId,
                  annotationid: editingFeature.options.dbid,
            },
            function success(response){
                console.log('Success:' + JSON.stringify(response));
                scope.annoComms = response.comment_set;
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

        var _round = function(num, len) {
                   return Math.round(num*(Math.pow(10, len)))/(Math.pow(10, len));
               };
        var strLatLng = function(latlng) {
            return "("+_round(latlng.lat, 6)+", "+_round(latlng.lng, 6)+")";
        };

        scope._showFeaturePanel = function(targetFeature){

            if (targetFeature instanceof L.Polygon) {
                panelType = 3;
               //获取面积数值
               var latlngs = targetFeature._defaultShape ? targetFeature._defaultShape() : targetFeature.getLatLngs(),
                    area = L.GeometryUtil.geodesicArea(latlngs);
                scope.polygonArea =  "面积: "+L.GeometryUtil.readableArea(area, true);
            }
            else if (targetFeature instanceof L.Polyline) {
                panelType = 2;
                //获取线长度
                var latlngs = targetFeature._defaultShape ? targetFeature._defaultShape() : targetFeature.getLatLngs(),
                    distance = 0;
                if (latlngs.length < 2) {
                    scope.polylineLen = "距离: N/A";
                } else {
                    for (var i = 0; i < latlngs.length-1; i++) {
                        distance += latlngs[i].distanceTo(latlngs[i+1]);
                    }
                    scope.polylineLen = "距离: "+_round(distance, 2)+" 米";
                }
            }
            else if (targetFeature instanceof L.Marker) {
                panelType = 1;
               //获取位置点经纬度
               scope.markerPos = strLatLng(targetFeature.getLatLng());

            }
            // console.log(panelType);
            return panelType;
        };


         scope._createAnnotation = function(categroy, geojson, feature) {
          //TODO 需要计算创建图元API参数所需的measure_str
            AnnotationListService.post(
            {
                  mapid: scope.projectId,
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

        scope._updateAnnotation = function(annotationid, geojson) {
          AnnotationService.update(
          {
                mapid: scope.projectId,
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

        scope.updateAnnotationTitle = function() {
          var annotationid = editingFeature.options.dbid;
          editingFeature.options.dbtitle = scope.annotationTitle;
          AnnotationService.update(
          {
                mapid: scope.projectId,
                annotationid: annotationid,
                title: scope.annotationTitle
          },
          function success(response){
              console.log('Success:' + JSON.stringify(response));
          },
          function error(errorResponse){
              console.log('Error:' + JSON.stringify(errorResponse));
          });
        };

        scope._delAnnotation = function() {
          var annotationid = editingFeature.options.dbid;
          AnnotationService.delete(
          {
                mapid: scope.projectId,
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

        scope.onNewCommentAcceptClick = function() {
          //保存新的备注
          AnnotationCommentService.post(
          {
                mapid: scope.projectId,
                annotationid: editingFeature.options.dbid,
                comment: scope.newComment
          },
          function success(response){
              console.log('Success:' + JSON.stringify(response));
              scope.newComment = "";
              _getAnnotation();

          },
          function error(errorResponse){
              console.log('Error:' + JSON.stringify(errorResponse));
          });
        };

        scope.isShowMarkerPanel = function() {
            if (panelType == 1) {
              return true;
            }
            return false;
        };

        scope.isShowPolylinePanel = function() {
            if (panelType == 2) {
              return true;
            }
            return false;
        };

        scope.isShowPolygonPanel = function() {
            if (panelType == 3) {
              return true;
            }
            return false;
        };
        // scope.isShowDelButton = function() {
        //     if (panelType != 0) {
        //       return true;
        //     }
        //     return false;
        // };
        scope.isAnnotationSelected = function() {
            if (panelType != 0) {
              return true;
            }
            return false;
        };

        scope.unSelectAnnotation = function () {
            panelType = 0;

        };
        scope.onDelFeatureClick = function() {
          //删除图元
          //调用删除标注API
          scope._delAnnotation();
        };

        scope.startDrawMarker = function() {
            //画Marker
            scope.marker = new $window.L.Draw.Marker(map, scope.drawControl.options);
            scope.marker.enable();
        };

        scope.startDrawPolyline = function() {
            //画线
            scope.polyline = new $window.L.Draw.Polyline(map, scope.drawControl.options);
            scope.polyline.enable();
        };

        scope.startDrawPolygon = function() {
            //画多边形
            scope.polygon = new $window.L.Draw.Polygon(map, scope.drawControl.options);
            scope.polygon.enable();
        };



      },
      controller: function() {

      },
      controllerAs: 'annotationPanel'


    };
  }]);
