/// <reference path='../modules.mdl.ts' />
/// <reference path='./league.ts' />

impakt.league = angular.module('impakt.league', [
	'impakt.league.browser',
	'impakt.league.drilldown',
	'impakt.league.modals'
])
.config([
'$stateProvider',
'$urlRouterProvider',
function(
	$stateProvider: any,
	$urlRouterProvider: any
) {
	console.debug('impakt.league - config');

	// impakt module states
	$stateProvider.state('league', {
		url: '/league', 
		templateUrl: 'modules/league/league.tpl.html',
		controller: 'league.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.league - run');
});
