/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.deleteFormation.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_playbookBrowser', 
'formation',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbookBrowser: any, 
	formation: any) {

	$scope.formation = formation;

	$scope.ok = function () {
		_playbookBrowser.deleteFormation($scope.formation)
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