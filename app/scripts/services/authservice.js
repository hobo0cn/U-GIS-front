
'use strict';
/* Services */
var uGisAuthServices = 
	angular.module('uGisAuthServices', ['ngResource']);
var API_SERVER_PATH = 'http://localhost:8000';
//var API_SERVER_PATH = 'http://112.74.189.43:9000';
uGisAuthServices
	.factory('SigupService', ['$resource', 
		function($resource) {
			//TODO Just for test address
			return $resource( API_SERVER_PATH+'/people/signup/', {}, {
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

uGisAuthServices
	.factory('RegisterRequestService', ['$resource',
		function($resource) {
			return $resource( API_SERVER_PATH+'/people/register_request/', {}, {
			  
			  post: {method: 'POST',  cache: false, isArray: false},
			 
			  },
			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);
	
uGisAuthServices
	.factory('ResetPasswordService', ['$resource',
		function($resource) {
			return $resource( API_SERVER_PATH+'/people/reset_password/', {}, {
			  
			  post: {method: 'POST',  cache: false, isArray: false},
			 
			  },
			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);

uGisAuthServices
	.factory('TokenAuthService', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource( API_SERVER_PATH+'/people/signin/', {}, {
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


