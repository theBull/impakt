/// <reference path='./nav.mdl.ts' />

declare var impakt: any;

impakt.nav.controller('nav.ctrl', [
	'$scope',
	'$window',
	'$location',
	'__notifications',
	function(
		$scope: any,
		$window: any,
		$location: any,
		__notifications: any) {

		$scope.isOnline = navigator.onLine;
		$window.addEventListener("offline", function(e) { 
			console.log('offline');
			$scope.isOnline = false;
		});
		$window.addEventListener("online", function(e) { 
			console.log('online');
			$scope.isOnline = true;
		});

		// Default menu visiblity
		$scope.isMenuCollapsed = true;
		$scope.notifications = __notifications.notifications;
		$scope.menuItems = [
			{
				label: 'Playbook',
				glyphicon: 'book',
				path: '/playbook',
				isActive: true
			},
			{
				label: 'Team Management',
				glyphicon: 'list-alt',
				path: '/team',
				isActive: false
			},
			{
				label: 'Film',
				glyphicon: 'film',
				path: '/film',
				isActive: false
			},
			{
				label: 'Stats',
				glyphicon: 'signal',
				path: '/stats',
				isActive: false
			}
		];

		// set default view
		$location.path('/playbook');
		
		$scope.navigatorNavSelection = getActiveNavItemLabel();

		$scope.menuVisibilityToggle = function() {
			$scope.isMenuCollapsed = !$scope.isMenuCollapsed;
		}

		$scope.menuItemClick = function(item: any) {
			var activeNavItem = getActiveNavItem();
			if(activeNavItem)
				activeNavItem.isActive = false;

			item.isActive = true;
			$location.path(item.path);
			$scope.navigatorNavSelection = item.label;
		}

		function getActiveNavItem() {
			// pre-assumption, we can only have 1 active menu item
			var activeItem = $scope.menuItems.filter(function(item: any) {
				return item.isActive === true;
			});
			return activeItem.length > 0 ? activeItem[0] : null;
		}

		function getActiveNavItemLabel() {
			var activeNavItem = getActiveNavItem();
			return activeNavItem ? activeNavItem.label : null;
		}
}]);