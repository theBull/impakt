/// <reference path='./nav.mdl.ts' />

declare var impakt: any;

impakt.nav.controller('nav.ctrl', [
	'$scope',
	'$location',
	'__nav',
	'__notifications',
	function(
		$scope: any,
		$location: any,
		__nav: any,
		__notifications: any) {

		// Default menu visiblity
		$scope.isMenuCollapsed = true;
		$scope.notifications = __notifications.notifications;

		$scope.menuItems = __nav.menuItems;
		$scope.notificationsMenuItem = __nav.notificationsMenuItem;
		$scope.searchMenuItem = __nav.searchMenuItem;

		// set default view to the Home module
		$location.path('/home');
		
		$scope.navigatorNavSelection = getActiveNavItemLabel();

		$scope.searchItemClick = function() {
			$scope.searchMenuItem.isActive = !$scope.searchMenuItem.isActive;
		}

		$scope.notificationItemClick = function() {
			$scope.notificationsMenuItem.isActive = !$scope.notificationsMenuItem.isActive;
			$scope.menuVisibilityToggle($scope.notificationsMenuItem, false);
		}

		$scope.menuVisibilityToggle = function(navigationItem: Navigation.NavigationItem, propagate?: boolean) {
			$scope.isMenuCollapsed = !$scope.isMenuCollapsed;
			propagate && $scope.menuItemClick(navigationItem);
		}

		$scope.menuItemClick = function(navigationItem: Navigation.NavigationItem) {
			let activeNavItem = getActiveNavItem();
			if(activeNavItem)
				activeNavItem.isActive = false;

			navigationItem.isActive = true;

			if(navigationItem)
				$location.path(navigationItem.path);

			$scope.navigatorNavSelection = navigationItem.label;
		}

		function getActiveNavItem(): Navigation.NavigationItem {
			// pre-assumption, we can only have 1 active menu item
			return $scope.menuItems.filterFirst(function(menuItem) {
				return menuItem.isActive === true;
			});
		}

		function getActiveNavItemLabel() {
			var activeNavItem = getActiveNavItem();
			return activeNavItem ? activeNavItem.label : null;
		}
}]);