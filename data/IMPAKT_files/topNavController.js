var topNavController = App.controller('topNavController', 
['$scope', '$log', '$location', function($scope, $log, $location) {

	$scope.navItems = [
		{
			label: 'Browser',
			view: 'browser', // case sensitive
			isActive: true,
			href: '#/playbook?view=browser'
		},
		{
			label: 'Editor',
			view: 'editor', // case sensitive
			isActive: false,
			href: '#/playbook?view=editor'
		},
		{
			label: 'Plan',
			view: 'plan', // case sensitive
			isActive: false,
			href: '#/playbook?view=plan'
		},
		// {
		// 	label: 'Layout',
		// 	isActive: false,
		// 	href: '#'
		// }
	]

	$scope.navClick = function(nav) {
		console.log(nav.view);
		$location.search({view: nav.view});
	}
}]);