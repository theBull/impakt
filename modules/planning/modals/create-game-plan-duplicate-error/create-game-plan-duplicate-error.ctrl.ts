/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.createGamePlanDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_planning', 
'gamePlan',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_planning: any, 
	gamePlan: any
) {

	$scope.gamePlan = gamePlan;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);