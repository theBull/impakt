// authentication service
var authenticationService = angular.module('App.authenticationServices', [])
.factory('authenticationService', function() {

	var API_ENDPOINT = 'http://test.impaktathletics.com';

	var self = {
		getToken: getToken
	}

	function getToken() {
		var config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		return $http.post(
			API_ENDPOINT, 
			'grant_type=password&username=fredf@imanufacture.com&Password=Abc123', 
			config
		);
	}

	return self;
});
