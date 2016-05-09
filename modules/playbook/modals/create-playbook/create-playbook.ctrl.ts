/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createPlaybook.ctrl', 
[
'$scope', '$uibModalInstance', '_playbook',
	function($scope: any, $uibModalInstance: any, _playbook: any) {

	$scope.unitTypeCollection = impakt.context.Team.unitTypes;
	$scope.selectedUnitType = $scope.unitTypeCollection.getByUnitType(Team.Enums.UnitTypes.Offense);
	$scope.newPlaybookModel = new Common.Models.PlaybookModel($scope.selectedUnitType);

	$scope.ok = function () {
		
		$scope.newPlaybookModel.unitType = $scope.selectedUnitType.unitType;
		
		_playbook.createPlaybook($scope.newPlaybookModel)
		.then(function(createdPlaybook: Common.Models.PlaybookModel) {
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