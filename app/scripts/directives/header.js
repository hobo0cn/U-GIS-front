'use strict';


angular.module('uGisFrontApp')
  .directive('dashboardHeader', ['$cookies', '$location', function($cookies, $location) {
    return {
      restrict: 'A',
      templateUrl: './views/dashboard-header.html',
      controller: function() {
        this.username = $cookies.get('EDM_username');
        var cat = $cookies.get('EDM_usercat');
        switch (cat) {
          case 'O':
            this.roler = '业主';
            break;
          case 'P':
            this.roler = '飞手';
            break;
          case 'A':
            this.roler = '管理员';
            break;
          case 'S':
            this.roler = '数据大师';
            break;
        }

        this.logout = function() {
          $cookies.remove('EDM_username');
          $cookies.remove('EDM_userid');
          $cookies.remove('EDM_usertoken');
          $cookies.remove('EDM_usercat');
          $cookies.remove('EDM_isAutoLogin');
          $location.path("#/login");


        };

      },
      controllerAs: 'header'


    };
  }]);
