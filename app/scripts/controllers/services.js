'use strict';
/* Services */
angular

	.module('uGisFrontApp', ['ngResource'])

	.factory('UGISPost', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource("http://localhost:8000/UGIS/start/:projectid", {}, {
		  //get: {method: 'GET', cache: false, isArray: false},
		  post: {method: 'POST', params:{projectid: '@projectid'}, cache: false, isArray: false},
		  //update: {method: 'PUT', cache: false, isArray: false},
		  //delete: {method: 'DELETE', cache: false, isArray: false}
		  });

		}
	]);
