/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.newEditor.ctrl', 
[
'$scope', 
'$uibModalInstance',
'_playbookEditor', 
'data',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbookEditor: any, 
	data: number
) {

	$scope.scenarios = impakt.context.Playbook.scenarios;
	$scope.plays = impakt.context.Playbook.plays;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.selectedScenario = $scope.scenarios.first();
	$scope.selectedPlay = $scope.plays.first();
	$scope.selectedFormation = $scope.formations.first();
	$scope.editScenarioSelected = false;
	$scope.editPlaySelected = false;
	$scope.editFormationSelected = false;

	$scope.selectScenario = function() {}
	$scope.selectPlay = function() {}
	$scope.selectFormation = function() {}
	$scope.editScenario = function() {
		$scope.editScenarioSelected = true;
		$scope.editPlaySelected = false;
		$scope.editFormationSelected = false;
		$scope.selectedPlay = null;
		$scope.selectedFormation = null;
	}
	$scope.editPlay = function() {
		$scope.editScenarioSelected = false;
		$scope.editPlaySelected = true;
		$scope.editFormationSelected = false;
		$scope.selectedScenario = null;
		$scope.selectedFormation = null;
	}
	$scope.editFormation = function() {
		$scope.editScenarioSelected = false;
		$scope.editPlaySelected = false;
		$scope.editFormationSelected = true;
		$scope.selectedScenario = null;
		$scope.selectedPlay = null;
	}

	$scope.ok = function () {
		if ($scope.selectedScenario)
			_playbookEditor.editScenario($scope.selectedScenario);
		if($scope.selectedPlay)
			_playbookEditor.editPlay($scope.selectedPlay);
		if ($scope.selectedFormation)
			_playbookEditor.editFormation($scope.selectedFormation);		

		$uibModalInstance.close();
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	}

}]);