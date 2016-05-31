/// <reference path='../season-drilldown.mdl.ts' />

impakt.season.drilldown.game = angular.module('impakt.season.drilldown.game', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.season.drilldown.game - config');
		
	$stateProvider.state('season.drilldown.game', {
		url: '/game',
		templateUrl: 'modules/season/drilldown/game/season-drilldown-game.tpl.html',
		controller: 'season.drilldown.game.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.season.drilldown.game - run');
});
