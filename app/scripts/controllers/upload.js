'use strict';

angular.module('uGisFrontApp')
.config(['flowFactoryProvider', 
  function (flowFactoryProvider) {
  flowFactoryProvider.defaults = {
    
    target: 'http://192.168.66.145:3000/upload/',
    //target: 'http://112.74.189.43:3000/upload/',
    permanentErrors: [404, 500, 501],
    chunkRetryInterval: 5000,
    testChunks:false,
    chunkSize: 9007199254740992,
    maxChunkRetries: 1,
    simultaneousUploads: 4,
  };
  flowFactoryProvider.on('catchAll', function (event) {
    console.log('catchAll', arguments);

  });
  flowFactoryProvider.on('complete', function (event) {
    // SelectFilesServices.uploadComplete();
    console.log('test', arguments);
  });
  // Can be used with different implementations of Flow.js
  // flowFactoryProvider.factory = fustyFlowFactory;
}]);


angular
    .module('uGisFrontApp')
    .controller('UploadController', ['$scope',  '$location', '$routeParams', 
      'LayerStartAnalysis', 'SelectFilesServices',
        function($scope, $location, $routeParams, LayerStartAnalysis, SelectFilesServices) {
          var layerId = $routeParams.layerid;
          $scope.mapid = $routeParams.mapid;
          var mapId = $scope.mapid ;
          $scope.layerid = $routeParams.layerid;
          $scope.config= {
            //TODO rerquest current map id
            query: {
                      project_id: mapId, 
                      task_id: layerId
                   }
          };
        var flowObj;

        var exifinfo = new Array();
        var filenum = 0;
        var exifJSON;

        var isFinishLoadFiles = function(Files){
           if(Files.length == filenum)
           {
              exifJSON = JSON.stringify(exifinfo)
              console.log('exinfo:' + exifJSON);
              //TODO invoke anaylsis images API
              //$scope.startAnalysis(exifJSON);
              SelectFilesServices.setFilesOriginExifInfo(exifJSON);
           }
        };

        $scope.filesAdded = function(files, _flowObj) {
            flowObj = _flowObj;
            SelectFilesServices.setFlow(_flowObj);

            for (var i = files.length - 1; i >= 0; i--) {;
              var reader = new FileReader();
              var file = files[i];
              reader.onload = function (event) {
                var exif, tags, tableBody, name, row;

                try {
                  exif = new ExifReader();

                  // Parse the Exif tags.
                  exif.load(event.target.result);
                  // Or, with jDataView you would use this:
                  //exif.loadView(new jDataView(event.target.result));

                  // The MakerNote tag can be really large. Remove it to lower memory usage.
                  exif.deleteTag('MakerNote');

                  // Output the tags on the page.
                  tags = exif.getAllTags();
                  //console.log('tags:' + JSON.stringify(tags));
                  exifinfo.push(tags);
                  filenum++;
                  isFinishLoadFiles(files);
                  
                  } catch (error) {
                    alert(error);
                  }
      
                };
                reader.readAsArrayBuffer(files[i].file.slice(0, 128 * 1024));
            }
            //read files
            console.log('filesAdded');
        };


        $scope.startAnalysis = function(){
           //TODO start analysis image process
           LayerStartAnalysis.post({mapid: $scope.mapid, layerid: 1, 
                                    exifinfo: exifJSON},
              function success(response){
                var info = JSON.parse(JSON.stringify(response));
                SelectFilesServices.setFilesInfo(info);

                console.log('Success:' + JSON.stringify(response));
                //route to upload image page.
                var mappath = '/task/' + $scope.mapid + '/' + $scope.layerid;
                $location.path(mappath);
            
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              });

        };

    }]);
