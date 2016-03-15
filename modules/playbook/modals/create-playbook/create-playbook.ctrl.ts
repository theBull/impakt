/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createPlaybook.ctrl', 
[
'$scope', '$uibModalInstance', '_playbook',
	function($scope: any, $uibModalInstance: any, _playbook: any) {

	$scope.newPlaybookModel = new Playbook.Models.PlaybookModel();
	$scope.unitType = Playbook.Editor.UnitTypes.Other;
	$scope.unitTypes = impakt.context.Playbook.unitTypes;
	$scope.selectedUnitType = $scope.unitTypes.getByUnitType($scope.unitType);

	$scope.selectUnitType = function(unitTypeValue: Playbook.Editor.UnitTypes) {
		$scope.selectedUnitType = $scope.unitTypes.getByUnitType(unitTypeValue);
	}

	$scope.ok = function () {
		
		$scope.newPlaybookModel.unitType = $scope.selectedUnitType.unitType;
		
		_playbook.createPlaybook($scope.newPlaybookModel)
		.then(function(createdPlaybook) {
			$uibModalInstance.close(createdPlaybook);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);