/// <reference path='../league-drilldown.mdl.ts' />

impakt.league.drilldown.team = angular.module('impakt.league.drilldown.team', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.league.drilldown.team - config');
	
	$stateProvider.state('league.drilldown.team', {
		url: '/team',
		templateUrl: 'modules/league/drilldown/team/league-drilldown-team.tpl.html',
		controller: 'league.drilldown.team.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.league.drilldown.team - run');
});
