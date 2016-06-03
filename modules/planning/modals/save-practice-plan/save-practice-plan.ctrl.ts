/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.savePracticePlan.ctrl', 
['$scope', 
'$uibModalInstance', 
'_planning', 
'practicePlan', 
function(
	$scope: any, 
	$uibModalInstance: any, 
	_planning: any,
	practicePlan: Planning.Models.PracticePlan
) {
	
	$scope.practicePlan = practicePlan;

	$scope.ok = function () {

		_planning.updatePracticePlan($scope.practicePlan)
		.then(function(savedPracticePlan) {
			$uibModalInstance.close(savedPracticePlan);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);