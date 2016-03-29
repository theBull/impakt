/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.deletePlaybook.ctrl', 
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
		_playbook.deletePlaybook($scope.playbook)
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