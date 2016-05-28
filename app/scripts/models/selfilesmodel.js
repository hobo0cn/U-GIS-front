'use strict';

/* Models */

	angular.module('uGisFrontApp')
	.service('SelectFilesServices', 
		function() {
			//TODO Just for test address
			var files = [];
			var setFiles = function(_files) {
				files = _files;
			};

			var getFiles = function(){
				return files;
			};

			var filesInfo = [];
			var setFilesInfo = function(info){
				filesInfo = info;
			};

			var getFilesInfo = function()
			{
				return filesInfo;
			};

			var flowObj;
			var setFlow = function(_flowObj){
				flowObj = _flowObj;
			};

			var getFlow = function(){
				return flowObj;
			};
			var uploadComplete = function(){
				var a = 0;
			}

			 return {
    			setFiles: setFiles,
    			getFiles: getFiles,
    			setFilesInfo: setFilesInfo,
    			getFilesInfo: getFilesInfo,
    			setFlow: setFlow,
    			getFlow: getFlow,
    			uploadComplete: uploadComplete
  			};


		}
	);
