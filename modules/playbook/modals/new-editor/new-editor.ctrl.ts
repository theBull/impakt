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

	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.unitTypes = impakt.context.Playbook.unitTypes;
	$scope.formationName = '';
	console.log($scope.playbooks);

	$scope.ok = function () {
		_playbookEditorTabs.openNew();
		$uibModalInstance.close();
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);