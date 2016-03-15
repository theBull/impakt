/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.saveFormation.ctrl', 
['$scope', 
'$uibModalInstance', 
'_playbook', 
'formation', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any,
	formation: Playbook.Models.Formation
) {

	$scope.formation = formation;
	$scope.copyFormation = false;
	var originalFormationKey = formation.key;
	var originalFormationName = formation.name;
	var originalFormationGuid = formation.guid;

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
				action: formation.modified ? 
					Common.API.Actions.Overwrite : // overwrite if modified
					Common.API.Actions.Nothing // do nothing if no changes
			}
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

}]);