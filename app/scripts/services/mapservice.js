
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

uGisServices
	.factory('LayerListService', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource('http://localhost:8000/map/:mapid/layer/', {mapid: '@mapid'}, {
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
			return $resource('http://localhost:8000/map/:mapid/layer/:layerid', {}, {
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
			return $resource('http://localhost:8000/map/:mapid/layer/:layerid/analysis-image/', 
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
			return $resource('http://localhost:8000/map/:mapid/layer/:layerid/coverage-analysis/', 
				{mapid: '@mapid', layerid: '@layerid'},
				{
				  post: {method: 'POST', cache: false, isArray: true}
			  	},

			  {
			  	stripTrailingSlashes: false
			  });

		}
	])
	.factory('LayerStartProcess', ['$resource',
		function($resource) {
			//TODO Just for test address
			return $resource('http://localhost:8000/map/:mapid/layer/:layerid/process-image/', 
				{mapid: '@mapid', layerid: '@layerid'},
				{
				  post: {method: 'POST', cache: false, isArray: false}
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
			return $resource('http://localhost:8000/map/:mapid/layer/:layerid/image/', 
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
			return $resource('http://localhost:8000/map/:mapid/layer/:layerid/image/:imageid', 
				{mapid: '@mapid', layerid: '@layerid', imageid: '@imageid'},
				  {
				  	get: {method: 'GET', cache: false, isArray: false},
				  },
				  {
				  	stripTrailingSlashes: false
				  });

		}
	]);

