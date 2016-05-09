/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.deleteFormation.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_associations',
'_playbook', 
'formation',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_playbook: any, 
	formation: any) {

	$scope.formation = formation;

	$scope.ok = function () {
		_playbook.deleteFormation($scope.formation)
		.then(function(results) {
			_associations.deleteAssociations($scope.formation.associationKey);
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