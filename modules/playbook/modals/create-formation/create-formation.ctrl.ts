/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createFormation.ctrl', 
['$scope', 
'$uibModalInstance', 
'_playbook',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any) {

	$scope.formation = new Playbook.Models.Formation();
	$scope.unitTypes = impakt.context.Playbook.unitTypes;
	$scope.selectedUnitType = $scope.unitTypes.getByUnitType(
		$scope.formation.unitType
	);

	$scope.ok = function () {
        $scope.formation.parentRK = 1; // TODO @theBull - deprecate parentRK
		_playbook.editFormation($scope.formation);
		$uibModalInstance.close();
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);