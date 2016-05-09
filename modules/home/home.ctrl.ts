/// <reference path='./home.mdl.ts' />

impakt.home.controller('home.ctrl',
['$scope', '$state', '_home',
function($scope: any, $state: any, _home: any) {

	$scope.menuItems = _home.menuItems;

	$scope.goTo = function(menuItem: Navigation.Models.NavigationItem) {
		$scope.menuItems.activate(menuItem);
	}

}]);