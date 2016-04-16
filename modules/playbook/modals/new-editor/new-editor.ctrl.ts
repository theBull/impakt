/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.newEditor.ctrl', 
[
'$scope', 
'$uibModalInstance',
'_playbookEditorTabs', 
'data',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbookEditorTabs: any, 
	data: number
) {

	$scope.plays = impakt.context.Playbook.plays;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.selectedPlay = null;
	$scope.selectedFormation = null;
	$scope.editPlaySelected = false;
	$scope.editFormationSelected = false;

	$scope.selectPlay = function() {}
	$scope.selectFormation = function() {}
	$scope.editPlay = function() {
		$scope.editPlaySelected = true;
		$scope.editFormationSelected = false;
		$scope.selectedFormation = null;
	}
	$scope.editFormation = function() {
		$scope.editPlaySelected = false;
		$scope.editFormationSelected = true;
		$scope.selectedPlay = null;
	}

	$scope.ok = function () {

		if($scope.selectedPlay)
			_playbookEditorTabs.editPlay($scope.selectedPlay);
		if ($scope.selectedFormation)
			_playbookEditorTabs.editFormation($scope.selectedFormation);		

		$uibModalInstance.close();
	}

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	}

}]);