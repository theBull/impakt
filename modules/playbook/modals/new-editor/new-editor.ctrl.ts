/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.newEditor.ctrl', 
[
'$scope', 
'$uibModalInstance',
'_playbookBrowser',
'_playbookEditorTabs', 
'data',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbookBrowser: any,
	_playbookEditorTabs: any, 
	data: number
) {

	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.unitTypes = impakt.context.Playbook.unitTypes;
	$scope.formationName = '';
	console.log($scope.playbooks);

	$scope.ok = function () {

		_playbookEditorTabs.newFormation($scope.formationName)
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