/// <reference path='../league-drilldown.mdl.ts' />

impakt.league.drilldown.division = angular.module('impakt.league.drilldown.division', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.league.drilldown.division - config');
		
	$stateProvider.state('league.drilldown.division', {
		url: '/division',
		templateUrl: 'modules/league/drilldown/division/league-drilldown-division.tpl.html',
		controller: 'league.drilldown.division.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.league.drilldown.division - run');
});
