/// <reference path='../planning.mdl.ts' />

impakt.planning.browser = angular.module('impakt.planning.browser', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.planning.browser - config');
	
	$stateProvider.state('planning.browser', {
		url: '/browser',
		templateUrl: 'modules/planning/browser/planning-browser.tpl.html',
		controller: 'planning.browser.ctrl'
	});
}])
.run(function() {
	console.debug('impakt.planning.browser - run');
});
