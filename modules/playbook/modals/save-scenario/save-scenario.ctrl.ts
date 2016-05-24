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

	$scope.ok = function () {
		
		// _playbook.saveScenario(scenario)
		// .then(function(savedScenario) {
		// 	$uibModalInstance.close(savedScenario);
		// }, function(err) {
		// 	console.error(err);
		// 	$uibModalInstance.close(err);
		// });

		$uibModalInstance.close(null);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);