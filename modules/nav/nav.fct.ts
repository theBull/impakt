/// <reference path='./nav.mdl.ts' />

// Nav factory
impakt.nav.factory('__nav', ['$http', '$q', function($http: any, $q: any) {
	console.log('nav factory');

	let menuItems = new Navigation.NavigationItemCollection();
	menuItems.add(
		new Navigation.NavigationItem(
			'playbook',
			'Playbook',
			'book',
			'/playbook/browser',
			true
		)
	);
	menuItems.add(
		new Navigation.NavigationItem(
			'team',
			'Team Management',
			'list-alt',
			'/team',
			false
		)
	);
	menuItems.add(
		new Navigation.NavigationItem(
			'profile',
			'Profile',
			'user',
			'/profile',
			false
		)
	);

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
		notificationsMenuItem: notificationsMenuItem
	};



}]);