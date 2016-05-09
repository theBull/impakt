/// <reference path='../playbook.mdl.ts' />

impakt.playbook.browser = angular.module('impakt.playbook.browser', [])
.config([
	'$stateProvider',
	function($stateProvider: any) {	
	
	console.debug('impakt.playbook.browser - config');

	$stateProvider.state('playbook.browser', {
		url: '/browser',
		templateUrl: 'modules/playbook/browser/playbook-browser.tpl.html',
		controller: 'playbook.browser.ctrl'
	});
}])
.run(function() {
	console.debug('impakt.playbook.browser - run');
});