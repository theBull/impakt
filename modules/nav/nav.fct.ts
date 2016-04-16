/// <reference path='./nav.mdl.ts' />

// Nav factory
impakt.nav.factory('__nav', ['$http', '$q', function($http: any, $q: any) {
	console.log('nav factory');

	let menuItems = new Navigation.Models.NavigationItemCollection();
	
	// Home
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'home',
			'Home',
			'home',
			'/home',
			true
		)
	);

	// Season
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'season',
			'Season',
			'calendar',
			'/season',
			false
		)
	);

	// Playbook
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'playbook',
			'Playbook',
			'book',
			'/playbook/browser',
			false
		)
	);

	// Planning
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'planning',
			'Planning',
			'blackboard',
			'/planning',
			false
		)
	);

	// Analysis
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'analysis',
			'Analysis',
			'facetime-video',
			'/analysis',
			false
		)
	);

	// Team
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'team',
			'Team Management',
			'list-alt',
			'/team',
			false
		)
	);

	// Profile
	menuItems.add(
		new Navigation.Models.NavigationItem(
			'profile',
			'Profile',
			'user',
			'/profile',
			false
		)
	);

	// Search
	let searchMenuItem = new Navigation.Models.NavigationItem(
		'search',
		'Search',
		'search',
		null,
		false
	);

	// Notifications
	let notificationsMenuItem = new Navigation.Models.NavigationItem(
		'notifications',
		'Notifications',
		'bell',
		null,
		false
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