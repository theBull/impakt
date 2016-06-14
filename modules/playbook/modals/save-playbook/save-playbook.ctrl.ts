/// <reference path='../playbook-modals.mdl.ts' />

impakt.playbook.modals.controller('playbook.modals.savePlaybook.ctrl', [
'$scope',
'$uibModalInstance',
'_playbook',
'playbook',
function(
	$scope: any,
	$uibModalInstance: any,
	_playbook: any,
	playbook: Common.Models.PlaybookModel
) {

	$scope.playbook = playbook;

	$scope.ok = function() {

		_playbook.updatePlaybook($scope.playbook)
			.then(function(savedPlaybook) {
				$uibModalInstance.close(savedPlaybook);
			}, function(err) {
				$uibModalInstance.close(err);
			});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

}]);