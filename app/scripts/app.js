'use strict';

// var uGisFrontApp = angular.module('uGisFrontApp',['ngRoute']);
// uGisFrontApp.config(['$routeProvider',function ($routeProvider) {
//       $routeProvider
//       .when('/', {
//         templateUrl: 'views/main.html',
//         controller: 'MainCtrl'
//       })
//       .when('/login', {
//           templateUrl: 'views/login.html',
//           controller: 'LoginCtrl'
//       })
//       .when('/register', {
//           templateUrl: 'views/register.html',
//           controller: 'RegisterCtrl'
//       })
//       .otherwise({
//         redirectTo: '/'
//       });
// }]);

angular
  .module('uGisFrontApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'uGisServices',
    'uGisAuthServices',
    'uGisProfileServices',
    'ngDialog',
    'flow',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/project', {
        templateUrl: 'views/projectlist.html',
        controller: 'ProjectListCtrl'
      })
      .when('/newproject', {
        templateUrl: 'views/newproject.html',
         controller: 'NewProjectCtrl'
      })
      .when('/project/:projectid/newtask', {
        templateUrl: 'views/newtask.html',
         controller: 'NewTaskCtrl'
      })
      .when('/task', {
        templateUrl: 'views/tasklist.html',
         controller: 'TaskListCtrl'
      })
      .when('/task/:projectid/:taskid', {
        templateUrl: 'views/task.html',
         controller: 'TaskCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/ownerdashboard.html',
        controller: 'OwnerDashboardCtrl'
      })
      .when('/project/:projectid', {
        templateUrl: 'views/ownerproject.html',
        controller: 'OwnerProjectCtrl'
      })
      .when('/upload/:mapid/:layerid', {
        templateUrl: 'views/upload.html',
        controller: 'UploadController'
      })
      //以下routing设置为旧程序，不再使用
      .when('/map', {
        templateUrl: 'views/maplist.html',
        controller: 'MapListCtrl'
      })
      .when('/map/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapViewCtrl'
      })
      
      // .when('/dashboard', {
      //   templateUrl: 'views/dashboard.html',
      //   controller: 'DashboardCtrl'
      // })
      // .when('/uploaddlg', {
      //   templateUrl: 'views/uploadDlg.html',
      //   controller: 'uploadDlgCtrl'
      // })
      // .when('/file', {
      //   templateUrl: 'views/fileinfo.html',
      //   controller: 'FileInfoCtrl'
      // })
      .otherwise({
        redirectTo: '/login'
      });
  });
