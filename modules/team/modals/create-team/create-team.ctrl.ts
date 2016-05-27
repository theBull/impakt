/// <reference path='../team-modals.mdl.ts' />
 
impakt.team.modals.controller('team.modals.createTeam.ctrl', [
'$scope', 
'$uibModalInstance', 
'_associations',
'_team',
'division',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_team: any,
	division: any
) {

	$scope.newTeamModel = new Team.Models.TeamModel(Team.Enums.TeamTypes.Primary);
	$scope.teamTypes = Common.Utilities.convertEnumToList(Team.Enums.TeamTypes);
	$scope.divisions = impakt.context.League.divisions;
	$scope.selectedDivision = division ? division : $scope.divisions.first();

	// TODO @theBull - implement locations
	$scope.locations = new Common.Models.Collection<Common.Interfaces.IActionable>();
	$scope.selectedLocation = null;

	function init(): void {
		if(Common.Utilities.isNotNullOrUndefined($scope.selectedDivision)) {
			$scope.newTeamModel.setDivision($scope.selectedDivision);
		}
	}

	$scope.selectDivision = function() {
		init();
	}

	$scope.ok = function () {
		
		_team.createTeam($scope.newTeamModel)
		.then(function(createdTeam: Team.Models.TeamModel) {

			let associationsToAdd = [
				$scope.selectedDivision
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