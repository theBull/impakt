/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.savePlay.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_playbook', 
'play', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any,
	play: Common.Interfaces.IPlay
) {

	$scope.play = play.copy();
	var playbookAPIOptions = new Playbook.Models.PlaybookAPIOptions();
	
	$scope.copyPlay = false;
	$scope.copyFormation = false;
	$scope.copyPersonnel = false;
	$scope.copyAssignmentGroup = false;

	// retain the orginal keys for toggling copy state
	var originalPlayKey = $scope.play.key;
	var originalFormationKey = $scope.play.formation.key;
	var originalAssignmentGroupKey = $scope.play.assignmentGroup.key;

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
		if($scope.play && $scope.copyPlay) {
			originalPlayKey = $scope.play.key;
			$scope.play.key = -1;
			playbookAPIOptions.play = Common.API.Actions.Copy;
			play = $scope.play;
		}
		if($scope.play.formation && $scope.copyFormation) {
			originalFormationKey = $scope.play.formation.key;
			$scope.play.formation.key = -1;
			playbookAPIOptions.formation = Common.API.Actions.Copy;
			play.formation = $scope.formation;
		}
		if ($scope.play.assignmentGroup && $scope.copyAssignmentGroup) {
			originalAssignmentGroupKey = $scope.play.assignmentGroup.key;
			$scope.play.assignmentGroup.key = -1;
			playbookAPIOptions.assignmentGroup = Common.API.Actions.Copy;
			play.assignmentGroup = $scope.assignmentGroup;	
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

}]);