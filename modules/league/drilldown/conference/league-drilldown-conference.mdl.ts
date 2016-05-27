/// <reference path='../league-drilldown.mdl.ts' />

impakt.league.drilldown.conference = angular.module('impakt.league.drilldown.conference', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.league.drilldown.conference - config');
		
	$stateProvider.state('league.drilldown.conference', {
		url: '/conference',
		templateUrl: 'modules/league/drilldown/conference/league-drilldown-conference.tpl.html',
		controller: 'league.drilldown.conference.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.league.drilldown.conference - run');
});
