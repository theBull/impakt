/// <reference path='./league-browser.mdl.ts' />

impakt.league.browser.controller('league.browser.ctrl', 
['$scope', '_league', '_leagueModals', '_teamModals',
function($scope: any, _league: any, _leagueModals: any, _teamModals: any) {

	$scope.leagues = impakt.context.League.leagues;
	$scope.teams = impakt.context.Team.teams;
	$scope.conferences = impakt.context.League.conferences;

	$scope.createLeague = function() {
		_leagueModals.createLeague();
	}

	$scope.createTeam = function() {
		_teamModals.createTeam();
	}

	$scope.teamDrilldown = function(team: Team.Models.TeamModel) {
		_league.toTeamDrilldown(team);
	}

}]);