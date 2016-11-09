
'use strict';
angular.module('uGisFrontApp')
  .controller('DataServiceDashboardCtrl', ['$scope', '$location', '$cookies', 
    'TaskService', 'LayerService', 'SelectFilesServices', 'ngDialog',
   function ($scope, $location, $cookies, TaskService, LayerService, SelectFilesServices, ngDialog) {
  
      $scope.username = $cookies.get('EDM_username');

      $scope.config= {
            query: {
                  
                   }
          };
      var flowObj;
      var _getTasks = function(){
           TaskService.get(
              function success(response){
                $scope.tasks = response;
                console.log('Success:' + JSON.stringify(response));
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
        };

      _getTasks();

      //完成数据处理任务
      $scope.completeServiceTask = function (projectid, taskid) {
          LayerService.update({mapid: projectid, layerid: taskid, status: 'D', 
                              map: projectid, stack_order: 1},
              function success(response){
                console.log('Success:' + JSON.stringify(response));
                _getTasks();
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
      };

      $scope.setUploadConfig = function(projectid, taskid, map_format) {
        $scope.config= {
            query: {
                      project_id: projectid, 
                      task_id: taskid
                   }
          };
        $scope.map_format = map_format;
      };

      $scope.filesAdded = function(files, _flowObj) {
            flowObj = _flowObj;
            SelectFilesServices.setFlow(_flowObj);
            $scope.filename = files[0].name;
            //read files
            console.log('filesAdded');
            //打开进度条对话框,并开始上传
            ngDialog.open({
                template: '../views/uploadDlg.html',
                closeByDocument: false,
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller: ['$scope', 'SelectFilesServices', 
                    function($scope, SelectFilesServices) {
                    // controller logic
                    $scope.flowObj = SelectFilesServices.getFlow();
                    $scope.flowObj.upload();

                }]
            });
        };

       $scope.uploadProcessImageComplete = function() {
         //上传处理的geotiff文件后，通知后台进行处理，由后台把任务状态修改为‘D’
          LayerUploadOrthphoto.post({mapid: mapId, layerid: layerId, 
                                    geotiff_file_name: $scope.filename, 
                                    format: $scope.map_format
                              },
              function success(response){
                console.log('Success:' + JSON.stringify(response));
              },
              function error(errorResponse){
                console.log('Error:' + JSON.stringify(errorResponse));
              }
            );
      };


  }]);
