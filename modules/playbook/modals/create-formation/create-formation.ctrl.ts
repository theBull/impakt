/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createFormation.ctrl', 
['$scope', 
'$uibModalInstance', 
'_playbookBrowser', 
'playbook',
'unitType',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbookBrowser: any,
	playbook: any,
	unitType: any) {

	$scope.formation = new Playbook.Models.Formation();
	$scope.unitType = unitType;
	$scope.playbook = playbook;

	$scope.ok = function () {

        $scope.formation.associated.playbooks.push($scope.playbook.guid);
        $scope.formation.associated.unitTypes.push($scope.unitType.guid);
        $scope.formation.unitType = $scope.unitType.unitType;
        $scope.formation.parentRK = $scope.playbook.key;

        console.log($scope.formation.toJson());
        
		_playbookBrowser.createFormation($scope.formation)
		.then(function(createdFormation) {
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