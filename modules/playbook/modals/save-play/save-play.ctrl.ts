/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.savePlay.ctrl', 
[
'$scope', 
'$uibModalInstance',
'__notifications',
'_playbook', 
'play', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	__notifications: any,
	_playbook: any,
	play: Common.Interfaces.IPlay
) {

	$scope.play = play.copy();
	var playbookAPIOptions = new Playbook.Models.PlaybookAPIOptions($scope.play);
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.categories = Common.Utilities.getEnumerationsOnly(Playbook.Enums.PlayCategories);
	$scope.copyPlay = false;
	$scope.copyFormation = false;
	$scope.copyPersonnel = false;
	$scope.copyAssignmentGroup = false;

	// retain the orginal keys for toggling copy state
	var originalPlayKey = $scope.play.key;
	var originalFormationKey = $scope.play.formation.key;
	var originalAssignmentGroupKey = $scope.play.assignmentGroup.key;

	function init() {
		if(Common.Utilities.isNullOrUndefined($scope.playbooks) ||
			$scope.playbooks.isEmpty()) {
			__notifications.error('There are no playbooks to save this play in, please create a playbook');
			$scope.cancel();
		}

		$scope.selectedPlaybook = $scope.playbooks.first();
	}

	$scope.selectPlaybook = function() {

	}
	$scope.selectCategory = function() {
		$scope.play.category = parseInt($scope.play.category);
	}
	$scope.hasAssignments = function() {
		return $scope.play && $scope.play.assignmentGroup && 
			$scope.play.assignmentGroup.assignments.hasElements();
	}

	$scope.copyPlayChange = function() {
		$scope.play.key = 
			$scope.copyPlay ? -1 : 
				originalPlayKey;
	}	
	$scope.copyFormationChange = function() {
		$scope.play.formation.key = 
			$scope.copyFormation ? -1 :
				originalFormationKey;
	}	
	$scope.copyAssignmentGroupChange = function() {
		$scope.play.assignmentGroup.key =
			$scope.copyAssignmentGroup ? -1 :
				originalAssignmentGroupKey;
	}


	$scope.ok = function () {
		let play = $scope.play;

		playbookAPIOptions.play = Common.API.Actions.Overwrite;
		playbookAPIOptions.formation = Common.API.Actions.Overwrite;
		playbookAPIOptions.assignmentGroup = _playbook.getAssignmentGroupAPIActions($scope.play.assignmentGroup);

		// If any of the following entities (play, formation, assignmentGroup)
		// exist on the play and their corresponding copy boolean
		// (copyPlay, copyFormation, copyPersonnel, copyAssignmentGroup) is set to true,
		// a new corresponding entity (Play, Formation, AssigmentGroup)
		// will be created and the new entity will have its values copied 
		// from the existing entity.
		// this new copied entity gets sent to server-side for creation.
		if(Common.Utilities.isNotNullOrUndefined($scope.play)) {
			if($scope.copyPlay) {
				originalPlayKey = $scope.play.key;
				$scope.play.key = -1;
				playbookAPIOptions.play = Common.API.Actions.Copy;
				play = $scope.play;
			}

		}

		if(Common.Utilities.isNotNullOrUndefined($scope.selectedPlaybook)) {
			playbookAPIOptions.associated.playbooks = [$scope.selectedPlaybook];
		}

		if(Common.Utilities.isNotNullOrUndefined($scope.play.formation)) {
		
			// COPY formation
			if($scope.copyFormation) {
				originalFormationKey = $scope.play.formation.key;
				$scope.play.formation.key = -1;
				playbookAPIOptions.formation = Common.API.Actions.Copy;
				play.formation = $scope.formation;
			}
			
			playbookAPIOptions.associated.formations = [play.formation];
		}

		if (Common.Utilities.isNotNullOrUndefined($scope.play.assignmentGroup)) {
			if($scope.copyAssignmentGroup) {
				originalAssignmentGroupKey = $scope.play.assignmentGroup.key;
				$scope.play.assignmentGroup.key = -1;
				playbookAPIOptions.assignmentGroup = Common.API.Actions.Copy;
				play.assignmentGroup = $scope.assignmentGroup;	
			}

			playbookAPIOptions.associated.assignmentGroups = [play.assignmentGroup];
		}
		
		_playbook.savePlay(play, playbookAPIOptions)
		.then(function(savedPlay) {
			$uibModalInstance.close(savedPlay);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

	init();

}]);