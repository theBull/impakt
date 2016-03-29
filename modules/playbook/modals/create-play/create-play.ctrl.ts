/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createPlay.ctrl', 
[
'$scope', '$uibModalInstance', '_playbook',
	function($scope: any, $uibModalInstance: any, _playbook: any) {

	$scope.newPlay = new Playbook.Models.Play();
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.assignments = impakt.context.Playbook.assignments;

	$scope.selectedPlaybook = $scope.playbooks.first();
	$scope.selectedFormation = $scope.formations.first();
	$scope.selectedAssignments = $scope.assignments.first();
	$scope.personnelCollection = impakt.context.Playbook.personnel;
	$scope.selectedPersonnel = $scope.personnelCollection.first();
	$scope.unitType = Playbook.Editor.UnitTypes.Other;
	$scope.unitTypes = impakt.context.Playbook.unitTypes;
	$scope.selectedUnitType = $scope.unitTypes.getByUnitType($scope.unitType);

	// Intialize new Play with data
	$scope.newPlay.setFormation($scope.selectedFormation);
	$scope.newPlay.setAssignments($scope.selectedAssignments);
	$scope.newPlay.setPersonnel($scope.selectedPersonnel);
	$scope.newPlay.unittype = $scope.unitType;

	// Add the new play onto the creation context, to access from
	// other parts of the application
	impakt.context.Playbook.creation.plays.add($scope.newPlay);

	$scope.selectUnitType = function(unitTypeValue: Playbook.Editor.UnitTypes) {
		$scope.selectedUnitType = $scope.unitTypes.getByUnitType(unitTypeValue);
	}

	$scope.selectPlaybook = function(playbook: Playbook.Models.PlaybookModel) {
		$scope.newPlay.setPlaybook($scope.playbooks.get(playbook.guid));
	}

	$scope.selectFormation = function(formation: Playbook.Models.Formation) {
		$scope.newPlay.setFormation($scope.formations.get(formation.guid));
	}
	$scope.selectAssignments = function(assignments: Playbook.Models.AssignmentCollection) {
		$scope.newPlay.setAssignments($scope.formations.get(assignments.guid));
	}
	$scope.selectPersonnel = function(personnel: Playbook.Models.Personnel) {
		$scope.newPlay.setPersonnel($scope.personnelCollection.get(personnel.guid));
	}

	$scope.ok = function () {
		
		$scope.newPlay.unitType = $scope.selectedUnitType.unitType;
		
		_playbook.createPlay($scope.newPlay)
		.then(function(createdPlay) {
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
		// Remove the play from the creation context, since we aren't
		// going to proceed with creating the play
		if($scope.newPlay)
			impakt.context.Playbook.creation.plays.remove($scope.newPlay.guid);
	}
}]);