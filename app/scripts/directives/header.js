'use strict';


angular.module('uGisFrontApp')
	   .directive('dashboardHeader', ['$cookies', function($cookies) {
	   		return {
	   			restrict: 'A',
	   			templateUrl: './views/dashboard-header.html',
	   			controller: function() {
	   				this.username = $cookies.get('EDM_username');
	   				var cat = $cookies.get('EDM_usercat');
	   				switch (cat){
	   					case 'O': 
	   						this.roler = '业主';
	   						break;
	   					case 'P': 
	   						this.roler = '飞手';
	   						break;
	   					case 'A':
	   						this.roler = '管理员';
	   						break;
	   					case 'S':
	   						this.roler = '数据大师';
	   						break;
	   				}
	   					
	   			},
	   			controllerAs: 'header'

	   		};
	   }]);