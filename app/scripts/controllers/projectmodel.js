'use strict';

angular.module('uGisFrontApp')
.factory('UProject',  function(projectid) {  
    function UProject(projectid) {
        
            this.projectid = projectid;
       
    }
    UProject.prototype = {
        set: function(projectid) {
            this.projectid = projectid;
        },
        get: function() {
        	return this.projectid;
        }
    };
    return UProject;
});