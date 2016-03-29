/// <reference path='./playbook.ts' />
/// <reference path='../modules.mdl.ts' />

impakt.playbook = angular.module('impakt.playbook', [
	'ui.router',
	'impakt.common',
	'impakt.playbook.contextmenus',
	'impakt.playbook.modals',
	'impakt.playbook.browser',
	'impakt.playbook.editor',
	'impakt.playbook.layout',
	'impakt.playbook.nav',
])
.config(
	['$stateProvider', 
	'$urlRouterProvider',
	function($stateProvider: any, 
		$urlRouterProvider: any) {

		console.debug('impakt.playbook - config');

		// impakt module states
		$stateProvider.state('playbook', {
			url: '/playbook',
			templateUrl: 'modules/playbook/playbook.tpl.html',
			controller: 'playbook.ctrl'
		});
}])
.run([
	'$stateParams', 
	'__localStorage', 
	function(
		$stateParams: any, 
		__localStorage: any) {

			console.debug('impakt.playbook - run');
}]);

