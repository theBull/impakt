/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.saveFormation.ctrl', 
['$scope', 
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
	
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.formation = play.formation.copy();
	$scope.play.formation = $scope.formation;
	$scope.copyFormation = false;
	$scope.associatedPlaybook;
	var originalFormationKey = $scope.formation.key;
	var originalFormationName = $scope.formation.name;
	var originalFormationGuid = $scope.formation.guid;

	function init() {
		// look for first associated playbook in formation
		let associatedPlaybook = false;
	}

	$scope.copyFormationChange = function() {
		$scope.formation.key = $scope.copyFormation ? -1 : originalFormationKey;
		$scope.formation.name = $scope.copyFormation ?
			$scope.formation.name + ' (copy)' :
			originalFormationName;
		$scope.formation.guid = $scope.copyFormation ?
			Common.Utilities.guid() :
			originalFormationGuid;
	}

	$scope.ok = function () {

		let options = { 
			formation: {
				action: Common.API.Actions.Overwrite // overwrite if modified
				//Common.API.Actions.Nothing // do nothing if no changes
			}
		}

		if(Common.Utilities.isNullOrUndefined($scope.formation.key)) {
			options.formation.action = Common.API.Actions.Create;
		}

		if($scope.copyFormation) {
			options.formation.action = Common.API.Actions.Copy;
		}

		_playbook.saveFormation($scope.formation, options)
		.then(function(savedFormation) {

			if($scope.copyFormation) {
				let contextFormation = impakt.context.Playbook.formations.get(savedFormation.guid);
				if(contextFormation) {
					// add new copied formation as new tab in editor
					_playbook.editFormation(contextFormation);
				}
			}

			console.log(savedFormation);
			$uibModalInstance.close(savedFormation);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$scope.formation.key = originalFormationKey;
		$scope.formation.name = originalFormationName;
		$uibModalInstance.dismiss();
	};

	init();

}]);