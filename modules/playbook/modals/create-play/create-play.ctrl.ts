/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createPlay.ctrl', [
'$scope', 
'$uibModalInstance', 
'_associations',
'_playbook',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_playbook: any
) {

	$scope.unitTypeCollection = impakt.context.Team.unitTypes;
	$scope.selectedUnitType =
		$scope.unitTypeCollection.getByUnitType(Team.Enums.UnitTypes.Offense).toJson();
	$scope.newPlay = new Common.Models.Play($scope.selectedUnitType.unitType);
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.assignments = impakt.context.Playbook.assignments;

	$scope.selectedPlaybook = $scope.playbooks.first();
	$scope.selectedFormation = $scope.formations.first();
	$scope.selectedAssignments = $scope.assignments.first();
	$scope.personnelCollection = impakt.context.Team.personnel;
	$scope.selectedPersonnel = $scope.personnelCollection.first();
	

	// Intialize new Play with data
	$scope.newPlay.setFormation($scope.selectedFormation);
	$scope.newPlay.setAssignments($scope.selectedAssignments);
	$scope.newPlay.setPersonnel($scope.selectedPersonnel);

	// Add the new play onto the creation context, to access from
	// other parts of the application
	impakt.context.Playbook.creation.plays.add($scope.newPlay);

	$scope.selectUnitType = function() {
		$scope.newPlay.unitType = $scope.selectedUnitType.unitType;
	}

	$scope.selectPlaybook = function(playbook: Common.Models.PlaybookModel) {
		$scope.newPlay.setPlaybook($scope.playbooks.get(playbook.guid));
	}

	$scope.selectFormation = function(formation: Common.Models.Formation) {
		$scope.newPlay.setFormation($scope.formations.get(formation.guid));
	}
	$scope.selectAssignments = function(assignments: Common.Models.AssignmentCollection) {
		$scope.newPlay.setAssignments($scope.formations.get(assignments.guid));
	}
	$scope.selectPersonnel = function(personnel: Team.Models.Personnel) {
		$scope.newPlay.setPersonnel($scope.personnelCollection.get(personnel.guid));
		$scope.selectedUnitType = $scope.unitTypeCollection.getByUnitType(personnel.unitType);
		$scope.selectUnitType($scope.selectedUnitType);
	}

	$scope.ok = function () {
				
		_playbook.createPlay($scope.newPlay)
		.then(function(createdPlay: Common.Models.Play) {
			_associations.createAssociations(createdPlay, [
				$scope.selectedPlaybook,
				$scope.selectedFormation,
				$scope.selectedPersonnel,
				$scope.selectedAssignments
			]);
			removePlayFromCreationContext();
			$uibModalInstance.close(createdPlay);
		}, function(err) {
			removePlayFromCreationContext();
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		removePlayFromCreationContext();
		$uibModalInstance.dismiss();
	};

	// Navigates to the team module
	$scope.toTeam = function() {
		let response = confirm('You are about to navigate to the Team module. Your play will not be created. Continue?');
		if (response) {
			$scope.cancel();
			_playbook.toTeam();
		}
	}

	function removePlayFromCreationContext() {
		// Remove the play from the creation context
		// after creating the new play or cancelling
		if(!Common.Utilities.isNullOrUndefined($scope.newPlay))
			impakt.context.Playbook.creation.plays.remove($scope.newPlay.guid);
	}
}]);