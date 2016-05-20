
'use strict';
/* Services */
var uGisServices = 
	angular.module('uGisServices', ['ngResource']);

uGisServices
	.factory('MapListService', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource('http://localhost:8000/map/', {}, {
			  // get: {method: 'GET'},
			  post: {method: 'POST',  cache: false, isArray: false},
			  // update: {method: 'PUT', cache: false, isArray: false},
			  // delete: {method: 'DELETE', cache: false, isArray: false}
			  },
			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);

uGisServices
	.factory('MapService', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource('http://localhost:8000/map/:id/', {}, {
			   get: {method: 'GET'},
			  //post: {method: 'POST', cache: false, isArray: false},
			  // update: {method: 'PUT', cache: false, isArray: false},
			   delete: {method: 'DELETE', cache: false, isArray: false}
			  },
			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);