/// <reference path='../playbook.mdl.ts' />
declare var impakt: any, angular: any;

impakt.playbook.layout = angular.module('impakt.playbook.layout', [])
.config([
	'$stateProvider',
	function($stateProvider: any) {

	console.debug('impakt.playbook.layout - config');


	$stateProvider.state('playbook.layout', {
		url: '/layout',
		views: {
			'sidebar': {},
			'main': {
				templateUrl: 'modules/playbook/layout/playbook-layout.tpl.html'
			},
			'details': {}
		}
	});

}])
.run(function() {
	console.debug('impakt.playbook.layout - run');
});