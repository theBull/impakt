/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createPlaybookDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_playbook', 
'playbook',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any, 
	playbook: any) {

	$scope.playbook = playbook;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);