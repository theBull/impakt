/// <reference path='./league-drilldown.mdl.ts' />

impakt.league.drilldown.controller('league.drilldown.ctrl', [
'$scope', 
'_details',
'_league',
function(
	$scope: any, 
	_details: any,
	_league: any
) {

	$scope.drilldown = _league.drilldown;

	$scope.toLeagueDrilldown = function(league: League.Models.LeagueModel) {
		_league.toLeagueDrilldown(league);
	}

	$scope.toConferenceDrilldown = function(conference: League.Models.Conference) {
		_league.toConferenceDrilldown(conference);
	}

	$scope.toDivisionDrilldown = function(division: League.Models.Division) {
		_league.toDivisionDrilldown(division);
	}

	$scope.toTeamDrilldown = function(team: Team.Models.TeamModel) {
		_league.toTeamDrilldown(team);
	}

	$scope.toBrowser = function() {
		_details.selectedElements.deselectAll();
		_league.toBrowser();
	}

}]);