/// <reference path='./nav.mdl.ts' />

declare var impakt: any;

impakt.nav.controller('nav.ctrl', [
	'$scope',
	'$location',
	'__nav',
    '__notifications',
    'appConfigurator',
    function(
        $scope: any,
        $location: any,
        __nav: any,
        __notifications: any,
        appConfigurator: any) {

      	$scope.appVer = appConfigurator.appVer;

		// Default menu visiblity
		$scope.isMenuCollapsed = true;
		$scope.notifications = __notifications.notifications;
		$scope.currentYear = (new Date()).getFullYear();

		$scope.menuItems = __nav.menuItems;
		$scope.notificationsMenuItem = __nav.notificationsMenuItem;
		$scope.searchMenuItem = __nav.searchMenuItem;

		// set default view to the Home module
		$location.path('/home');
		
		$scope.navigatorNavSelection = getActiveNavItemLabel();

		$scope.searchItemClick = function() {
			$scope.searchMenuItem.toggleActivation();
		}

		$scope.notificationItemClick = function() {
			$scope.notificationsMenuItem.isActive = !$scope.notificationsMenuItem.isActive;
			$scope.menuVisibilityToggle($scope.notificationsMenuItem, false);
		}

		$scope.menuVisibilityToggle = function(navigationItem: Navigation.Models.NavigationItem, propagate?: boolean) {
			$scope.isMenuCollapsed = !$scope.isMenuCollapsed;
			propagate && $scope.menuItemClick(navigationItem);
		}

		$scope.menuItemClick = function(navigationItem: Navigation.Models.NavigationItem) {
			$scope.menuItems.activate(navigationItem);
			$scope.navigatorNavSelection = navigationItem.label;
		}

		function getActiveNavItemLabel() {
			var activeNavItem = $scope.menuItems.getActive();
			return activeNavItem ? activeNavItem.label : null;
		}
}]);