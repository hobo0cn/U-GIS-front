"use strict";

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
    'ngTouch'
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
      .otherwise({
        redirectTo: '/'
      });
  });
