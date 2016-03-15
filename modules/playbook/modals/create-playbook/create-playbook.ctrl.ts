/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createPlaybook.ctrl', 
[
'$scope', '$uibModalInstance', '_playbookBrowser',
	function($scope: any, $uibModalInstance: any, _playbookBrowser: any) {

	$scope.playbookName = '';
	$scope.unitType = Playbook.Editor.UnitTypes.Other;
	$scope.unitTypes = impakt.context.Playbook.unitTypes;
	$scope.selectedUnitType = $scope.unitTypes.getByUnitType($scope.unitType);

	$scope.selectUnitType = function(unitTypeValue: Playbook.Editor.UnitTypes) {
		$scope.selectedUnitType = $scope.unitTypes.getByUnitType(unitTypeValue);
	}

	$scope.ok = function () {
		_playbookBrowser.createPlaybook($scope.playbookName, $scope.unitType)
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