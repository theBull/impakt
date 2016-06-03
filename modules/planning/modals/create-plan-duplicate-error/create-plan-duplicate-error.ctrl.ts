/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.createPlanDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_planning', 
'plan',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_planning: any, 
	plan: any) {

	$scope.plan = plan;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);