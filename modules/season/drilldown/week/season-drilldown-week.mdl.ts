/// <reference path='../season-drilldown.mdl.ts' />

impakt.season.drilldown.week = angular.module('impakt.season.drilldown.week', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.season.drilldown.week - config');
		
	$stateProvider.state('season.drilldown.week', {
		url: '/week',
		templateUrl: 'modules/season/drilldown/week/season-drilldown-week.tpl.html',
		controller: 'season.drilldown.week.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.season.drilldown.week - run');
});
