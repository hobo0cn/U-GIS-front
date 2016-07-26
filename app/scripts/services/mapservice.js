
'use strict';
/* Services */
var uGisServices = 
	angular.module('uGisServices', ['ngResource']);
var API_SERVER_PATH = 'http://localhost:8000';
//var API_SERVER_PATH = 'http://112.74.189.43:9000';
uGisServices
	.factory('MapListService', ['$resource', '$cookies', 'ProfileServices',
		function($resource, $cookies, ProfileServices) {
			//TODO Just for test address
			return $resource( API_SERVER_PATH+'/map/', {}, {
			  // get: {method: 'GET'},
			  post: {method: 'POST',  cache: false, isArray: false, 
						 headers: {
			                    'Authorization': 'Token ' + $cookies.get('EDM_usertoken')
			                }
              },
			  get: {method: 'GET', cache: false, isArray: true, 
						headers: {
			                    'Authorization': 'Token ' + $cookies.get('EDM_usertoken')
			                }
				},
			  // delete: {method: 'DELETE', cache: false, isArray: false}
			  },
			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);

uGisServices
	.factory('MapService', ['$resource', '$cookies',
		function($resource, $cookies) {
			//TODO Just for test address
			return $resource(API_SERVER_PATH+'/map/:id/', {}, {
			   get: {
			   			method: 'GET',
				   		headers: {
				                    'Authorization': 'Token ' + $cookies.get('EDM_usertoken')
				                }
					},
			  //post: {method: 'POST', cache: false, isArray: false},
			  // update: {method: 'PUT', cache: false, isArray: false},
			   delete: {method: 'DELETE', cache: false, isArray: false,
						headers: {
					                    'Authorization': 'Token ' + $cookies.get('EDM_usertoken')
					                }
			            }
			  			},
			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);

uGisServices
	.factory('LayerListService', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource(API_SERVER_PATH+'/map/:mapid/layer/', {mapid: '@mapid'}, {
			  post: {method: 'POST', cache: false, isArray: false},
			  },
			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);

uGisServices
	.factory('LayerService', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource(API_SERVER_PATH+'/map/:mapid/layer/:layerid/', {mapid: '@mapid', layerid:'@layerid'}, {
				  get: {method: 'GET', cache: false, isArray: false},
				  update: {method: 'PUT', cache: false, isArray: false},
				  delete: {method: 'DELETE', cache: false, isArray: false}
			  },
			  {
			  	stripTrailingSlashes: false
			  });

		}
	])
	.factory('LayerStartAnalysis', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource(API_SERVER_PATH+'/map/:mapid/layer/:layerid/analysis-image/', 
				{mapid: '@mapid', layerid: '@layerid'},
				{
				  post: {method: 'POST', cache: false, isArray: true}
			  	},

			  {
			  	stripTrailingSlashes: false
			  });

		}
	])
	.factory('LayerCoverageAnalysis', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource(API_SERVER_PATH+'/map/:mapid/layer/:layerid/coverage-analysis/', 
				{mapid: '@mapid', layerid: '@layerid'},
				{
				  post: {method: 'POST', cache: false, isArray: true}
			  	},

			  {
			  	stripTrailingSlashes: false
			  });

		}
	])
	.factory('LayerStartProcess', ['$resource', '$cookies', 'ProfileServices',
		function($resource, $cookies, ProfileServices) {
			//TODO Just for test address
			return $resource(API_SERVER_PATH+'/map/:mapid/layer/:layerid/process-image/', 
				{mapid: '@mapid', layerid: '@layerid'},
				{
				  post: {method: 'POST', cache: false, isArray: false,
						headers: {
			                    'Authorization': 'Token ' + $cookies.get('EDM_usertoken')
			                }
			            }
			  	},

			  {
			  	stripTrailingSlashes: false
			  });

		}
	]);

uGisServices
	.factory('LayerImageListService', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource(API_SERVER_PATH+'/map/:mapid/layer/:layerid/image/', 
							{mapid: '@mapid', layerid: '@layerid'},
						  {
						  		get: {method: 'GET', cache: false, isArray: false},
						  },
						  {
						  	stripTrailingSlashes: false
						  });

		}
	])
	.factory('LayerImageService', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource(API_SERVER_PATH+'/map/:mapid/layer/:layerid/image/:imageid', 
				{mapid: '@mapid', layerid: '@layerid', imageid: '@imageid'},
				  {
				  	get: {method: 'GET', cache: false, isArray: false},
				  },
				  {
				  	stripTrailingSlashes: false
				  });

		}
	]);

uGisServices
	.factory('TaskService', ['$resource','$cookies', 
		function($resource, $cookies) {
			
			return $resource(API_SERVER_PATH+'/UGIS/tasks/', {}, 
				  {
				  	get: {method: 'GET', cache: false, isArray: false, 
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

