/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.deletePlay.ctrl', 
[
'$scope', '$uibModalInstance', '_playbook', 'play',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any, 
	play: any) {

	$scope.play = play;

	$scope.ok = function () {
		_playbook.deletePlay($scope.play)
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