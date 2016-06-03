/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.deletePracticePlan.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_planning', 
'practicePlan',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_planning: any, 
	practicePlan: any
) {

	$scope.practicePlan = practicePlan;

	$scope.ok = function () {
		_planning.deletePracticePlan($scope.practicePlan)
		.then(function(results) {
			$rootScope.$broadcast('delete-practicePlan', $scope.practicePlan);
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