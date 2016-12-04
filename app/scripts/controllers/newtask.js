'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('NewTaskCtrl', ['$scope', '$window', '$location', '$routeParams', 
    '$cookies', 'LayerListService', 
    'MapService', 'ProfileService',
  	function ($scope, $window, $location, $routeParams, 
      $cookies, LayerListService, 
      MapService, ProfileService) {
     
     var mapId = $routeParams.projectid;

     var _getProjectArea = function(){
           MapService.get({id: mapId},
              function success(response){
                $scope.map = response;
                //map.setView([$scope.map.center_x, $scope.map.center_y], 15);
                //$scope.area_geojson = JSON.stringify(eval("(" + response.area + ")"));
                $scope.area_geojson  = JSON.parse(response.area );
                console.log('Success:' + JSON.stringify(response));

                $window.L.geoJson($scope.area_geojson).addTo(map);
                map.panTo({lat: $scope.map.center_x, lng: $scope.map.center_y});
                //_jugeMapStatus();
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
        }

      var _getServiceUsers = function() {
        ProfileService.get({user_cate: 'S'},
            function success(response){
                $scope.serviceUsers = response;
                
                console.log('Success:' + JSON.stringify(response));

              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
          );
      };

      var _getPilotUsers = function() {
         ProfileService.get({user_cate: 'P'},
            function success(response){
                $scope.pilotUsers = response;
                console.log('Success:' + JSON.stringify(response));
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
          );
      };



      $scope.start_today = function() {
        $scope.startdate = new Date();
      };
      $scope.end_today = function() {
        $scope.enddate = new Date();
      };
      $scope.start_today();
      $scope.end_today();

      $scope.popup_startdate = {
        opened: false
      };
      $scope.popup_enddate = {
        opened: false
      };

        $scope.dateOptions = {
          
          formatYear: 'yy',
          maxDate: new Date(2020, 5, 22),
          minDate: new Date(),
          startingDay: 1
        };
        

        $scope.open_startdate = function() {
          $scope.popup_startdate.opened = true;
        };

        $scope.open_enddate = function() {
          $scope.popup_enddate.opened = true;
        };
      

        var map = $window.L.map('mapid',{zoomControl: false}).setView([39.58, 116.38], 9);
        map.addControl(new $window.L.control.zoom({position: 'bottomright',zoomInText:'',zoomOutText:''}));

        $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 30,
        
        }).addTo(map);

        _getProjectArea();
        _getServiceUsers();
        _getPilotUsers();


        var sidebar = $window.L.control.sidebar('sidebar', {
            closeButton: false,
            position: 'left'
        });
        map.addControl(sidebar);
        sidebar.show();
        

        // Initialise the FeatureGroup to store editable layers
        var drawnItems = new $window.L.FeatureGroup();
        map.addLayer(drawnItems);

        // Initialise the draw control and pass it the FeatureGroup of editable layers
        var drawControl = new $window.L.Control.Draw({
            draw: {
              polyline: false,
              marker: false,
              rectangle: false,
              circle: false
            },
            edit: {
                featureGroup: drawnItems
            }
        });
        map.addControl(drawControl);

        map.on('draw:created', function (e) {
            var type = e.layerType,
            layer = e.layer;
            drawnItems.addLayer(layer);
            $scope.taskShape = layer.toGeoJSON()
            $scope.taskAreaPoly= JSON.stringify($scope.taskShape);

        });

        //TODO画出项目范围
        $(window).on("resize", function() {
          $("#mapid").height($(window).height())
                .width($(window).width());
          
          map.invalidateSize();
      }).trigger("resize");

        

      $scope.createTask = function() {
          
          LayerListService.post(
             {
              mapid: $scope.map.id,
              name: $scope.taskName,
              description: $scope.taskDesc,
              start_date: $scope.startdate.getFullYear()+ '-'+ $scope.startdate.getMonth() + '-' + $scope.startdate.getDate(),
              end_date: $scope.enddate.getFullYear()+ '-'+ $scope.enddate.getMonth() + '-' + $scope.enddate.getDate(),
              area: $scope.taskAreaPoly,
              stack_order: 1, 
              //指派的飞行员、数据处理工程师
              service: $scope.selectedService,
              pilot: $scope.selectedPilot,
              //选择是否处理正射、高程、NVDI数据
              check_Orth: $scope.check_Orth,
              check_Ele: $scope.check_Ele,
              check_NVDI: $scope.check_NVDI
              // project_category: 1
            }, 
            function success(response){
               $location.path('/project');
        
            },
            function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
            });
        };


  }]);
