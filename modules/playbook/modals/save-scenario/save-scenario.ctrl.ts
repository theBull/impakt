/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.saveScenario.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_playbook', 
'scenario', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any,
	scenario: Common.Models.Scenario
) {

	$scope.scenario = scenario.copy();
	var playPrimaryAPIOptions = new Playbook.Models.PlaybookAPIOptions($scope.scenario.playPrimary);
	var playOpponentAPIOptions = new Playbook.Models.PlaybookAPIOptions($scope.scenario.playOpponent);

	$scope.ok = function () {
		
		if(Common.Utilities.isNotNullOrUndefined($scope.scenario.playPrimary)) {
			playPrimaryAPIOptions.play = Common.API.Actions.Overwrite;
			playPrimaryAPIOptions.formation = Common.API.Actions.Overwrite;
			playPrimaryAPIOptions.assignmentGroup = _playbook.getAssignmentGroupAPIActions($scope.scenario.playPrimary.assignmentGroup);
		}
		if (Common.Utilities.isNotNullOrUndefined($scope.scenario.playOpponent)) {
			playOpponentAPIOptions.play = Common.API.Actions.Overwrite;
			playOpponentAPIOptions.formation = Common.API.Actions.Overwrite;
			playOpponentAPIOptions.assignmentGroup = _playbook.getAssignmentGroupAPIActions($scope.scenario.playOpponent.assignmentGroup);
		}
	
		_playbook.saveScenario(scenario, playPrimaryAPIOptions, playOpponentAPIOptions)
		.then(function(savedScenario) {
			$uibModalInstance.close(savedScenario);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});

		$uibModalInstance.close(null);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);