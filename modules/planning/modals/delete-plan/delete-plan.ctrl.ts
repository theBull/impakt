/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.deletePlan.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_planning', 
'plan',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_planning: any, 
	plan: any) {

	$scope.plan = plan;

	$scope.ok = function () {
		_planning.deletePlan($scope.plan)
		.then(function(results) {
			$rootScope.$broadcast('delete-plan', $scope.plan);
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