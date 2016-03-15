/// <reference path='./user.mdl.ts' />

impakt.user.controller('impakt.user.ctrl', [
	'$scope', 
	'$http', 
	'$window',
	'__signin', 
	function(
		$scope: any, 
		$http: any, 
		$window: any,
		__signin: any
	) {
	
	console.log('user controller');

	$scope.profileClick = function() {
		// TODO
	}

	$scope.logout = function() {
		__signin.logout();
	}

}]);