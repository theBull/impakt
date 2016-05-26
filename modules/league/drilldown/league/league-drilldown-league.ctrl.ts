/// <reference path='./league-drilldown-league.mdl.ts' />

impakt.league.drilldown.league.controller('league.drilldown.league.ctrl', [
'$scope', 
'_associations',
'_league', 
'_leagueModals', 
function(
	$scope: any,
	_associations: any, 
	_league: any, 
	_leagueModals: any
) {

	$scope.league = _league.drilldown.league;
	$scope.conferences = new League.Models.ConferenceCollection();
	$scope.teamData = {};

	function init() {
		let leagueAssociations = _associations.getAssociated($scope.league);

		if (Common.Utilities.isNotNullOrUndefined(leagueAssociations) &&
			leagueAssociations.conferences.hasElements()) {
			$scope.conferences = leagueAssociations.conferences;

			if(Common.Utilities.isNotNullOrUndefined($scope.conferences)) {
				$scope.conferences.forEach(function(conference: League.Models.Conference, index: number) {
					let conferenceAssociations = _associations.getAssociated(conference);
					if(Common.Utilities.isNotNullOrUndefined(conferenceAssociations)) {
						$scope.teamData[conference.guid] = conferenceAssociations;
					}
				});
			}
		}
	}

	$scope.createConference = function() {
		_leagueModals.createConference().then(function() {
			init();	
		});
	}

	$scope.delete = function() {
		_leagueModals.deleteLeague($scope.league);
	}

	init();

}]);