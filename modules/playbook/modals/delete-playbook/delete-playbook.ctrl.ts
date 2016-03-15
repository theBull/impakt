/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.deletePlaybook.ctrl', 
[
'$scope', '$uibModalInstance', '_playbookBrowser', 'playbook',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbookBrowser: any, 
	playbook: any) {

	$scope.playbook = playbook;

	$scope.ok = function () {
		_playbookBrowser.deletePlaybook($scope.playbook)
		.then(function(results) {
			$uibModalInstance.close(results);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);