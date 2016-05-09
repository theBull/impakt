/// <reference path='../league.mdl.ts' />

impakt.league.drilldown = angular.module('impakt.league.drilldown', [
	'impakt.league.drilldown.league',
	'impakt.league.drilldown.team'
])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.league.drilldown - config');
	
	$stateProvider.state('league.drilldown', {
		url: '/drilldown',
		templateUrl: 'modules/league/drilldown/league-drilldown.tpl.html',
		controller: 'league.drilldown.ctrl'
	});
	
}])
.run(function() {
	console.debug('impakt.league.drilldown - run');
});
