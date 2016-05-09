/// <reference path='./league-drilldown-league.mdl.ts' />

impakt.league.drilldown.league.controller('league.drilldown.league.ctrl', [
'$scope', 
'_league', 
'_leagueModals', 
function(
	$scope: any, 
	_league: any, 
	_leagueModals: any
) {

	$scope.league = _league.drilldown.league;

	$scope.delete = function() {
		_leagueModals.deleteLeague($scope.league);
	}

}]);