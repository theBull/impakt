var browserController = App.controller('browserController', 
	['$scope', '$log', function($scope, $log) {

		debug.log('browser controller');

		// Default menu visiblity
		$scope.isMenuCollapsed = true;
		$scope.menuItems = [
			{
				label: 'Playbook',
				glyphicon: 'book',
				isActive: true
			},
			{
				label: 'Film',
				glyphicon: 'film',
				isActive: false
			},
			{
				label: 'Stats',
				glyphicon: 'signal',
				isActive: false
			},
			{
				label: 'Roster',
				glyphicon: 'list-alt',
				isActive: false
			}
		];
		
		$scope.browserNavSelection = getActiveNavItemLabel();

		$scope.menuVisibilityToggle = function() {
			$scope.isMenuCollapsed = !$scope.isMenuCollapsed;
		}

		$scope.menuItemClick = function(item) {
			var activeNavItem = getActiveNavItem();
			if(activeNavItem)
				activeNavItem.isActive = false;

			item.isActive = true;
			$scope.browserNavSelection = item.label;
		}

		function getActiveNavItem() {
			// pre-assumption, we can only have 1 active menu item
			var activeItem = $scope.menuItems.filter(function(item) {
				return item.isActive === true;
			});
			return activeItem.length > 0 ? activeItem[0] : null;
		}

		function getActiveNavItemLabel() {
			var activeNavItem = getActiveNavItem();
			return activeNavItem ? activeNavItem.label : null;
		}
}]);