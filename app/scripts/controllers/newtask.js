'use strict';

/**
 * @ngdoc function
 * @name uGisFrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the uGisFrontApp
 */
angular.module('uGisFrontApp')
	.controller('NewTaskCtrl', ['$scope', '$window', '$location', '$cookies', 'MapListService', 
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
        

        var marker = $window.L.marker([51.2, 7]).addTo(map).on('click', function () {
            sidebar.toggle();
        });

        $(window).on("resize", function() {
          $("#mapid").height($(window).height())
                .width($(window).width());
          
          map.invalidateSize();
      }).trigger("resize");


  }]);
