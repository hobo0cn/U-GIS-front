'use strict';

/* Models */

	angular.module('uGisFrontApp')
	.service('ProfileServices', 
		function() {
			//TODO Just for test address
			var userName;
			var setUserName = function(_username) {
				userName = _username;
			};

			var getUserName = function(){
				return userName;
			};

			var userToken;
			var setUserToken = function(token){
				userToken = token;
			};

			var getUserToken = function()
			{
				return userToken;
			};

			 return {
    			setUserName: setUserName,
    			getUserName: getUserName,
    			setUserToken: setUserToken,
    			getUserToken: getUserToken
  			};


		}
	);
