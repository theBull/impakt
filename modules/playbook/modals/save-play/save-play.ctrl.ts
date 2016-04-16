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
	play: Common.Models.Play
) {

	$scope.play = play;
	$scope.copyPlay = false;
	$scope.copyFormation = false;
	$scope.copyPersonnel = false;
	$scope.copyAssignments = false;

	// retain the orginal keys for toggling copy state
	var originalPlayKey = $scope.play.key;
	var originalFormationKey = $scope.play.formation.key;
	var originalAssignmentsKey = $scope.play.assignments.key;

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
	$scope.copyAssignmentsChange = function() {
		$scope.play.assignments.key =
			$scope.copyAssignments ? -1 :
				originalAssignmentsKey;
	}


	$scope.ok = function () {
		let play = $scope.play;

		// determine whether there are changes to the entity; if so,
		// set action to overwrite, otherwise set action to nothing

		// track options for how to send the data to the server
		// TO-DO: create a better model for this
		let options = {
			play: {
				action: play.modified ? Common.API.Actions.Overwrite : Common.API.Actions.Nothing
			},
			formation: {
				action: play.formation.modified ? Common.API.Actions.Overwrite : Common.API.Actions.Nothing
			},
			// TO-DO: implement assignments
			assignments: {
				action: Common.API.Actions.Nothing
			}
		}

		// If any of the following entities (play, formation, assignments)
		// exist on the play and their corresponding copy boolean
		// (copyPlay, copyFormation, copyPersonnel, copyAssignments) is set to true,
		// a new corresponding entity (Play, Formation, Assigments)
		// will be created and the new entity will have its values copied 
		// from the existing entity.
		// this new copied entity gets sent to server-side for creation.
		if($scope.play && $scope.copyPlay) {
			originalPlayKey = $scope.play.key;
			$scope.play.key = -1;
			options.play.action = Common.API.Actions.Copy;
			play = $scope.play;
		}
		if($scope.play.formation && $scope.copyFormation) {
			originalFormationKey = $scope.play.formation.key;
			$scope.play.formation.key = -1;
			options.formation.action = Common.API.Actions.Copy;
			play.formation = $scope.formation;
		}
		if ($scope.play.assignments && $scope.copyAssignments) {
			console.error('save play assignments not implemented');
		}
		
		_playbook.savePlay(play, options)
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