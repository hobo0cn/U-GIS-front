'use strict';

angular


    .module('uGisFrontApp', ['angularFileUpload'])


    .controller('FileUploadController', ['$scope', '$attrs', '$http', '$location', 'FileUploader',
        function($scope, $attrs, $http, $location, FileUploader) {
        $scope.isAllComplete = false;
        $scope.isProcessing = false;
        $scope.processUserTip = "Start process";
        
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://192.168.66.136:3000/upload',
        });


        uploader.formData.push({project_id:$attrs.project});

        // FILTERS

       uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            $scope.isAllComplete = true;
        };

        $scope.isAllCompleteSuccess = function(){
            // return $scope.isAllComplete;

            if($scope.processUserTip == "Start process" && $scope.isAllComplete==true){
                return true;
            }
            else if($scope.processUserTip == "Open")
            {
                return true;
            }
            return false;
        }
        $scope.clearImageQueue = function(){
            uploader.clearQueue();
            $scope.isAllComplete = false;
        }

        $scope.startProcess = function(){
            // //TODO Just test projectid
            // UGISPost.post({projectid: '2', function(){
            //     $location.path('/');
            // }});
            // var data = $.param({
            // json: JSON.stringify({
            //     projectid: $attrs.project
            //     })
            // });
            if($scope.processUserTip == "Start process"){
                var data = JSON.stringify({
                    projectid: $attrs.project
                    });
                
                $http.post("http://localhost:8000/UGIS/start/", data).success(function(data, status) {
                    $scope.rtn = data;
                })
                $scope.isProcessing = true;
                $scope.processUserTip = "Open";
            }
            else if($scope.processUserTip == "Open")
            {
                //TODO Open Map html
                var mapview = '/map.html';
                $location.path(mapview);
            }

            
            
        }

        console.info('uploader', uploader);
    }]);
