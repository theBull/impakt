/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.createPracticePlanDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_planning', 
'practicePlan',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_planning: any, 
	practicePlan: any
) {

	$scope.practicePlan = practicePlan;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);