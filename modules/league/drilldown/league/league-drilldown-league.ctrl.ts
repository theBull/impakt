/// <reference path='./league-drilldown-league.mdl.ts' />

impakt.league.drilldown.league.controller('league.drilldown.league.ctrl', [
'$scope', 
'$rootScope',
'_associations',
'_league', 
'_leagueModals',
function(
	$scope: any,
	$rootScope: any,
	_associations: any, 
	_league: any, 
	_leagueModals: any
) {

	$scope.league = _league.drilldown.league;
	$scope.conferences = new League.Models.ConferenceCollection();

	let deleteConferenceListener = $rootScope.$on('delete-conference', function(e: any, conference: League.Models.Conference) {
		$scope.conferences.remove(conference.guid);
	});

	let associationsUpdatedListener = $rootScope.$on('associations-updated', function(e: any) {
		init();
	});

	$scope.$on('$destroy', function() {
		deleteConferenceListener();
		associationsUpdatedListener();
	});

	function init() {
		let leagueAssociations = _associations.getAssociated($scope.league);

		if (Common.Utilities.isNotNullOrUndefined(leagueAssociations)) {
			$scope.conferences = leagueAssociations.conferences;
			$scope.conferences.forEach(function(conference: League.Models.Conference, index: number) {
				let conferenceAssociations = _associations.getAssociated(conference);
				conference.setLeague($scope.league);
			});
		}
	}

	$scope.createConference = function() {
		_leagueModals.createConference($scope.league)
		.then(function() {
			init();	
		});
	}

	init();

}]);