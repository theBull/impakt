/// <reference path='../season-drilldown.mdl.ts' />

impakt.season.drilldown.season = angular.module('impakt.season.drilldown.season', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.season.drilldown.season - config');
		
	$stateProvider.state('season.drilldown.season', {
		url: '/season',
		templateUrl: 'modules/season/drilldown/season/season-drilldown-season.tpl.html',
		controller: 'season.drilldown.season.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.season.drilldown.season - run');
});
