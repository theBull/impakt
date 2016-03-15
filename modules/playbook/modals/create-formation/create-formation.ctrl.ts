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

        $scope.formation.parentRK = 1;
        $scope.formation.setDefault();

        // TO DO: validate data
        
		_playbook.createFormation($scope.formation)
		.then(function(createdFormation) {

			// TO DO: navigate to editor with formation

			$uibModalInstance.close(createdFormation);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);