'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('DashboardCtrl', ['$scope', '$location', '$window', 
		'MapListService', 'MapService',
  	function ($scope, $location, $window, MapListService, MapService) {
    
      $scope.maps = MapListService.query();

      
      $scope.newMap = function(){
        MapListService.post({name: "New Map",
							owner: 1,
							zoom: 1 ,
							center_x: 0,
							center_y: 0},
							function success(response){
                				var map = response;
				                console.log('Success:' + JSON.stringify(response));     
				                var uploadpath = '/upload/' + map.id;
              					$location.path(uploadpath);          
				                     
				            },
				            function error(errorResponse){
				                console.log('Error:' + JSON.stringify(errorResponse));
				            });

        $scope.maps = MapListService.query();
    };

    $scope.deleteMap = function(mapId){
        MapService.delete({id: mapId})

        $scope.maps = MapListService.query()
    };

	var map = $window.L.map('mapid').setView([51.505, -0.09], 5);

	
	// $window.L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaG9ibzBjbiIsImEiOiJjaW9zNXRjdmowMDZldWxtNXM1OThqazczIn0.UTfVL-F6P3n0xM1G0KCipA', {
 //        maxZoom: 30,
     
       
	// }).addTo(map);


	$window.L.tileLayer('http://121.69.39.114:9009/arctiler/arcgis/services/GoogleChinaHybridMap/MapServer/tile/{z}/{y}/{x}', {
		maxZoom: 30,
	
	}).addTo(map);

	$window.L.Icon.Default.imagePath = 'bower_components/leaflet/dist/images';
	// map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));	//base layer
	
	map.addControl( new L.Control.Search({
			url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
			// jsonpParam: 'json_callback',
			propertyName: 'display_name',
			propertyLoc: ['lat','lon'],
			circleLocation: false,
			markerLocation: true,			
			autoType: true,
			autoCollapse: true,
			minLength: 3
		}) );



	$(window).on("resize", function() {
	    $("#mapid").height($(window).height())
	    		  .width($(window).width());
	    
	    map.invalidateSize();
	}).trigger("resize");

	// var info;
	// $scope.openNewMapDlg = function(){
	// 	if(!info){
	//       	info = $window.L.control({position: 'topleft'});

	// 		info.onAdd = function (map) {
	// 		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	// 		    this.update();
	// 		    return this._div;
	// 		};

	// 		// method that we will use to update the control based on feature properties passed
	// 		info.update = function (props) {
	// 		    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
	// 		        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
	// 		        : 'Hover over a state');
	// 		};

	// 		info.addTo(map);
	// 	}
	// 	else{
	// 		info.removeFrom(map);
	// 		info = null;
	// 	}
 //      };

      $scope.switchMapListView = function(){
      	$location.path('/map');
      };

      $scope.createNewMap = function() {
      	//创建map，并打开上传页面
      	$scope.newMap();
      };

  }]);
