/// <reference path='./nav.mdl.ts' />

// Nav factory
impakt.nav.factory('__nav', ['$http', '$q', function($http: any, $q: any) {
	console.log('nav factory');

	let menuItems = new Navigation.NavigationItemCollection();
	
	// Home
	menuItems.add(
		new Navigation.NavigationItem(
			'home',
			'Home',
			'home',
			'/home',
			true
		)
	);

	// Season
	menuItems.add(
		new Navigation.NavigationItem(
			'season',
			'Season',
			'calendar',
			'/season',
			false
		)
	);

	// Playbook
	menuItems.add(
		new Navigation.NavigationItem(
			'playbook',
			'Playbook',
			'book',
			'/playbook/browser',
			false
		)
	);

	// Planning
	menuItems.add(
		new Navigation.NavigationItem(
			'planning',
			'Planning',
			'blackboard',
			'/planning',
			false
		)
	);

	// Team
	menuItems.add(
		new Navigation.NavigationItem(
			'team',
			'Team Management',
			'list-alt',
			'/team',
			false
		)
	);

	// Profile
	menuItems.add(
		new Navigation.NavigationItem(
			'profile',
			'Profile',
			'user',
			'/profile',
			false
		)
	);

	// Search
	let searchMenuItem = new Navigation.NavigationItem(
		'search',
		'Search',
		'search',
		null,
		false
	);

	// Notifications
	let notificationsMenuItem = new Navigation.NavigationItem(
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