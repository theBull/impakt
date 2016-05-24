/// <reference path='./nav.mdl.ts' />

// Nav factory
impakt.nav.factory('__nav', [
'$http', 
'$q',
'$state',
function(
	$http: any, 
	$q: any,
	$state: any
) {

	let menuItems = new Navigation.Models.NavigationItemCollection();
	
	// Home
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'home',
			'Home',
			'home',
			'/home',
			true,
			function(self: Navigation.Models.NavigationItem) {
				$state.transitionTo('home');
			}
		)
	);

	// League
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'league',
			'League',
			'globe',
			'/league',
			false,
			function(self: Navigation.Models.NavigationItem) {
				$state.transitionTo('league.browser');
			}
		)
	);

	// Season
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'season',
			'Season',
			'calendar',
			'/season',
			false,
			function(self: Navigation.Models.NavigationItem) {
				$state.transitionTo('season');
			}
		)
	);

	// Playbook
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'playbook',
			'Playbook',
			'book',
			'/playbook/browser',
			false,
			function(self: Navigation.Models.NavigationItem) {
				$state.transitionTo('playbook.browser');
			}
		)
	);

	// Planning
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'planning',
			'Planning',
			'blackboard',
			'/planning',
			false,
			function(self: Navigation.Models.NavigationItem) {
				$state.transitionTo('planning');
			}
		)
	);

	// Analysis
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'analysis',
			'Analysis',
			'facetime-video',
			'/analysis',
			false,
			function(self: Navigation.Models.NavigationItem) {
				$state.transitionTo('analysis');
			}
		)
	);

	// Team
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'team',
			'Team',
			'list-alt',
			'/team',
			false,
			function(self: Navigation.Models.NavigationItem) {
				$state.transitionTo('team');
			}
		)
	);

	// Profile
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'profile',
			'Profile',
			'user',
			'/profile',
			false,
			function(self: Navigation.Models.NavigationItem) {
				$state.transitionTo('profile');
			}
		)
	);

	// Search
	let searchMenuItem = new Navigation.Models.NavigationItem(
		'search',
		'Search',
		'search',
		null,
		false,
		function(self: Navigation.Models.NavigationItem) {}
	);

	// Notifications
	let notificationsMenuItem = new Navigation.Models.NavigationItem(
		'notifications',
		'Notifications',
		'bell',
		null,
		false,
		function(self: Navigation.Models.NavigationItem) {}
	);
	
	// TODO @theBull - implement
	// ,
	// film: {
	// 	label: 'Film',
	// 	glyphicon: 'film',
	// 	path: '/film',
	// 	isActive: false
	// },
	// stats: {
	// 	label: 'Stats',
	// 	glyphicon: 'signal',
	// 	path: '/stats',
	// 	isActive: false
	// }

	return {
		menuItems: menuItems,
		searchMenuItem: searchMenuItem,
		notificationsMenuItem: notificationsMenuItem
	};



}]);