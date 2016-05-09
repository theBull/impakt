/// <reference path='./league-drilldown-team.mdl.ts' />

impakt.league.controller('league.drilldown.team.ctrl', 
['$scope', '_league', '_teamModals', 
function($scope: any, _league: any, _teamModals: any) {

	$scope.team = _league.drilldown.team;

	$scope.delete = function() {
		_teamModals.deleteTeam($scope.team);
	}

}]);