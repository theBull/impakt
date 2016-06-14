/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.deleteScenario.ctrl', [
'$scope',
'$uibModalInstance', 
'_playbook', 
'scenario',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any, 
	scenario: any
) {

	$scope.scenario = scenario;

	$scope.ok = function () {
		_playbook.deleteScenario($scope.scenario)
		.then(function(results) {
			$uibModalInstance.close(results);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);