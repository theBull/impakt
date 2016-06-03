/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.savePlan.ctrl', 
['$scope', 
'$uibModalInstance', 
'_planning', 
'plan', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_planning: any,
	plan: Planning.Models.Plan
) {
	
	$scope.plan = plan;

	$scope.ok = function () {

		_planning.updatePlan($scope.plan)
		.then(function(savedPlan) {
			$uibModalInstance.close(savedPlan);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);