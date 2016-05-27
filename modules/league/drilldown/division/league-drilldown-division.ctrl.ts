/// <reference path='./league-drilldown-division.mdl.ts' />

impakt.league.drilldown.division.controller('league.drilldown.division.ctrl', [
'$scope', 
'$rootScope',
'_associations',
'_league', 
'_leagueModals', 
'_teamModals',
function(
	$scope: any,
	$rootScope: any,
	_associations: any, 
	_league: any, 
	_leagueModals: any,
	_teamModals: any
) {

	$scope.league = _league.drilldown.league;
	$scope.conference = _league.drilldown.conference;
	$scope.division = _league.drilldown.division;
	$scope.teams = new Team.Models.TeamModelCollection(Team.Enums.TeamTypes.Mixed);

	let deleteTeamListener = $rootScope.$on('delete-team', function(e: any, team: Team.Models.TeamModel) {
		$scope.teams.remove(team.guid);
	});

	let associationsUpdatedListener = $rootScope.$on('associations-updated', function(e: any) {
		init();
	});

	$scope.$on('$destroy', function() {
		associationsUpdatedListener();
		deleteTeamListener();
	});

	function init() {		
		let divisionAssociations = _associations.getAssociated($scope.division);
		$scope.division.setConference($scope.conference);

		if (Common.Utilities.isNotNullOrUndefined(divisionAssociations)) {
			$scope.teams = divisionAssociations.teams;
			$scope.teams.forEach(function(team: Team.Models.TeamModel, index: number) {
				let teamAssociations = _associations.getAssociated(team);
				team.setDivision($scope.division);
			});
		}
	}

	$scope.createTeam = function(division: League.Models.Division) {
		_teamModals.createTeam(division)
		.then(function() {
			init();
		});
	}

	init();

}]);