/// <reference path='../team-modals.mdl.ts' />
 
impakt.team.modals.controller('team.modals.createTeam.ctrl', [
'$scope', 
'$uibModalInstance', 
'_associations',
'_team',
'_leagueModals',
'division',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_team: any,
	_leagueModals: any,
	division: any
) {

	$scope.newTeamModel = new Team.Models.TeamModel();
	$scope.teamTypes = Common.Utilities.convertEnumToList(Team.Enums.TeamTypes);
	$scope.divisions = impakt.context.League.divisions;
	$scope.locations = impakt.context.League.locations;
	$scope.selectedDivision = division ? division : $scope.divisions.first();
	$scope.selectedLocation = $scope.locations.first();

	function init(): void {
		$scope.selectDivision();
		$scope.selectLocation();
	}

	$scope.selectDivision = function() {
		if (Common.Utilities.isNotNullOrUndefined($scope.selectedDivision)) {
			$scope.newTeamModel.setDivision($scope.selectedDivision);
		}
	}

	$scope.selectLocation = function() {
		if (Common.Utilities.isNotNullOrUndefined($scope.selectedLocation)) {
			$scope.newTeamModel.setLocation($scope.selectedLocation);
		}
	}

	$scope.createLocation = function() {
		_leagueModals.createLocation().then(function(createdLocation: League.Models.Location) {
			$scope.locations = impakt.context.League.locations;
			$scope.selectedLocation = createdLocation;
			$scope.setLocation();
		})
	}

	$scope.ok = function () {
		
		_team.createTeam($scope.newTeamModel)
		.then(function(createdTeam: Team.Models.TeamModel) {

			let associationsToAdd = [
				$scope.selectedDivision,
				$scope.selectedLocation
			];

			if (Common.Utilities.isNotNullOrUndefined($scope.selectedDivision.conference)) {
				associationsToAdd.push($scope.selectedDivision.conference);
			}
			if (Common.Utilities.isNotNullOrUndefined($scope.selectedDivision.conference.league)) {
				associationsToAdd.push($scope.selectedDivision.conference.league);
			}

			_associations.createAssociations(createdTeam, associationsToAdd);

			$uibModalInstance.close(createdTeam);
		}, function(err) {
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

	function removeTeamFromCreationContext() {
		// Remove the play from the creation context
		// after creating the new play or cancelling
		if (Common.Utilities.isNotNullOrUndefined($scope.newTeamModel))
			impakt.context.Team.creation.teams.remove($scope.newTeam.guid);
	}

	init();
}]);