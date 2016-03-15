/// <reference path='../playbook.mdl.ts' />

impakt.playbook.browser = angular.module('impakt.playbook.browser', [
	'impakt.playbook.browser.sidebar',
	'impakt.playbook.browser.main',
	'impakt.playbook.browser.details'
])
.config([
	'$stateProvider',
	function($stateProvider: any) {	
	
	console.debug('impakt.playbook.browser - config');

	$stateProvider.state('playbook.browser', {
		url: '/browser',
		views: {
			'sidebar': {
				templateUrl: 'modules/playbook/browser/sidebar/playbook-browser-sidebar.tpl.html',
				controller: 'playbook.browser.sidebar.ctrl'
			},
			'main': {
				templateUrl: 'modules/playbook/browser/main/playbook-browser-main.tpl.html',
				controller: 'playbook.browser.main.ctrl',
			},
			'details': {
				templateUrl: 'modules/playbook/browser/details/playbook-browser-details.tpl.html',
				controller: 'playbook.browser.details.ctrl'
			},
		}
	});
}])
.run(function() {
	console.debug('impakt.playbook.browser - run');
});