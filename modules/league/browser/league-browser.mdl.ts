/// <reference path='../league.mdl.ts' />

impakt.league.browser = angular.module('impakt.league.browser', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.league.browser - config');
	
	$stateProvider.state('league.browser', {
		url: '/browser',
		templateUrl: 'modules/league/browser/league-browser.tpl.html',
		controller: 'league.browser.ctrl'
	});
}])
.run(function() {
	console.debug('impakt.league.browser - run');
});
