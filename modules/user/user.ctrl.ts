/// <reference path='./user.mdl.ts' />

impakt.user.controller('impakt.user.ctrl', [
	'$scope', 
	'$http', 
	'$window',
	'__signin', 
	'_user',
	function(
		$scope: any, 
		$http: any, 
		$window: any,
		__signin: any,
		_user: any
	) {
	
	$scope.userName = _user.userName;
	$scope.organizationKey = _user.organizationKey;
	$scope.isOnline = _user.isOnline;
	$scope.onlineStatus = _user.getOnlineStatusString();
	$scope.organizations = _user.organizations;
	$scope.selectedOrganization = _user.selectedOrganization;

	$scope.$watch('isOnline', function(newVal, oldVal) {
		$scope.onlineStatus = _user.getOnlineStatusString();		
	});

	$scope.selectOrganization = function() {
		_user.selectOrganization($scope.selectedOrganization);
	}

	$scope.profileClick = function() {
		// TODO
	}

	$scope.logout = function() { 
		confirm('Are you sure you want to logout? You will lose any unsaved data.')	&& __signin.logout();
	}

}]);