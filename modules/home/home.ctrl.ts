/// <reference path='./home.mdl.ts' />

impakt.home.controller('home.ctrl',
['$scope', '$state', '__context', '_home',
function($scope: any, $state: any, __context: any, _home: any) {

	$scope.currentOrganization;
	$scope.menuItems = _home.menuItems;

	$scope.goTo = function(menuItem: Navigation.Models.NavigationItem) {
		$scope.menuItems.activate(menuItem);
	}

	__context.onReady(function() {
		$scope.currentOrganization = impakt.context.Organization.current;
	});

}]);