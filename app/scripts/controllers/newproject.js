'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('NewProjectCtrl', ['$scope', '$window', '$location', '$cookies', 'MapListService', 
    'MapService', 'ProfileServices',
  	function ($scope, $window, $location, $cookies, MapListService, MapService, ProfileServices) {
        


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
      

        var map = $window.L.map('mapid').setView([51.2, 7], 9);


        $window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 30,
        
        }).addTo(map);

        var sidebar = $window.L.control.sidebar('sidebar', {
            // closeButton: true,
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
            $scope.projectShape = layer.toGeoJSON();
            $scope.projectAreaPoly= JSON.stringify($scope.projectShape);
            $scope.mes_control.addLayer(layer);
        });

        //测量面积工具
        // setting options 
       var mes_options = {geodesic: true};

       //input parameter is Array of layers
       var mes_layers = [];

       // initialize control
       $scope.mes_control = $window.L.Control.measureAreaControl(mes_options, mes_layers).addTo(map);
        

        $(window).on("resize", function() {
          $("#mapid").height($(window).height())
                .width($(window).width());
          
          map.invalidateSize();
        }).trigger("resize");

        var polygonCenter  = function(poly){
          var lowx,
              highx,
              lowy,
              highy,
              lats = [],
              lngs = [],
              vertices = poly.geometry.coordinates[0];

          for(var i=0; i<vertices.length; i++) {
            lngs.push(vertices[i][0]);
            lats.push(vertices[i][1]);
          }

          lats.sort();
          lngs.sort();
          lowx = lats[0];
          highx = lats[vertices.length - 1];
          lowy = lngs[0];
          highy = lngs[vertices.length - 1];
          var center_x = lowx + ((highx-lowx) / 2);
          var center_y = lowy + ((highy - lowy) / 2);
          return {center_x, center_y};
        };

        $scope.createProject = function() {
          
          var center = polygonCenter($scope.projectShape);
          
          MapListService.post(
             {
              name: $scope.projectName,
              description: $scope.projectDesc,
              zoom: 9 ,
              start_date: $scope.startdate.getFullYear()+ '-'+ $scope.startdate.getMonth() + '-' + $scope.startdate.getDate(),
              end_date: $scope.enddate.getFullYear()+ '-'+ $scope.enddate.getMonth() + '-' + $scope.enddate.getDate(),
              center_x: center.center_x,
              center_y: center.center_y,
              area: $scope.projectAreaPoly,
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
