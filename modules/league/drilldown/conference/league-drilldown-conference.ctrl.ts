/// <reference path='./league-drilldown-conference.mdl.ts' />

impakt.league.drilldown.conference.controller('league.drilldown.conference.ctrl', [
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
	$scope.divisions = new League.Models.DivisionCollection();

	let deleteDivisionListener = $rootScope.$on('delete-division', function(e: any, division: League.Models.Division) {
		$scope.divisions.remove(division.guid);
	});

	let associationsUpdatedListener = $rootScope.$on('associations-updated', function(e: any) {
		init();
	});

	$scope.$on('$destroy', function() {
		deleteDivisionListener();
		associationsUpdatedListener();
	});

	function init() {
		let conferenceAssociations = _associations.getAssociated($scope.conference);
		$scope.conference.setLeague($scope.league);

		if (Common.Utilities.isNotNullOrUndefined(conferenceAssociations)) {
			$scope.divisions = conferenceAssociations.divisions;
			$scope.divisions.forEach(function(division: League.Models.Division, index: number) {
				let divisionAssociations = _associations.getAssociated(division);
				division.setConference($scope.conference);						
			});
		}
	}

	$scope.createDivision = function(conference: League.Models.Conference) {
		_leagueModals.createDivision(conference)
		.then(function() {
			init();
		});
	}

	$scope.toDivisionDrilldown = function(division: League.Models.Division): void {
		_league.toDivisionDrilldown(division);
	}

	init();

}]);