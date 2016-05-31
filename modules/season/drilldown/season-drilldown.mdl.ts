/// <reference path='../season.mdl.ts' />

impakt.season.drilldown = angular.module('impakt.season.drilldown', [
	'impakt.season.drilldown.season',
	'impakt.season.drilldown.week',
	'impakt.season.drilldown.game'
])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.season.drilldown - config');
	
	$stateProvider.state('season.drilldown', {
		url: '/drilldown',
		templateUrl: 'modules/season/drilldown/season-drilldown.tpl.html',
		controller: 'season.drilldown.ctrl'
	});
	
}])
.run(function() {
	console.debug('impakt.season.drilldown - run');
});
