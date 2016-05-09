/// <reference path='../league-drilldown.mdl.ts' />

impakt.league.drilldown.league = angular.module('impakt.league.drilldown.league', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.league.drilldown.league - config');
		
	$stateProvider.state('league.drilldown.league', {
		url: '/league',
		templateUrl: 'modules/league/drilldown/league/league-drilldown-league.tpl.html',
		controller: 'league.drilldown.league.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.league.drilldown.league - run');
});
