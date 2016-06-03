/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.saveGamePlan.ctrl', 
['$scope', 
'$uibModalInstance', 
'_planning', 
'gamePlan', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_planning: any,
	gamePlan: Planning.Models.GamePlan
) {
	
	$scope.gamePlan = gamePlan;

	$scope.ok = function () {

		_planning.updateGamePlan($scope.gamePlan)
		.then(function(savedGamePlan) {
			$uibModalInstance.close(savedGamePlan);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);