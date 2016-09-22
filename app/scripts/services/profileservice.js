
'use strict';
/* Services */
var uGisAuthServices = 
	angular.module('uGisProfileServices', ['ngResource']);
 var API_SERVER_PATH = 'http://localhost:8000';
//var API_SERVER_PATH = 'http://112.74.189.43:9000';
uGisAuthServices
	.factory('ProfileService', ['$resource', '$cookies',
		function($resource, $cookies) {
			//TODO Just for test address
			return $resource( API_SERVER_PATH+'/profile/', {}, {
			  
			  get: {method: 'GET',  cache: false, isArray: true,
					headers: {
			                    'Authorization': 'Token ' + $cookies.get('EDM_usertoken')
			                }

			  },
			},
			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);