/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.updateFormation.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_playbook', 
'formation',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any, 
	formation: any
) {

	$scope.formation = formation;

	$scope.ok = function () {
		_playbook.updateFormation($scope.formation)
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