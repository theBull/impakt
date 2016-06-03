/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.deleteGamePlan.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_planning', 
'gamePlan',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_planning: any, 
	gamePlan: any
) {

	$scope.gamePlan = gamePlan;

	$scope.ok = function () {
		_planning.deleteGamePlan($scope.gamePlan)
		.then(function(results) {
			$rootScope.$broadcast('delete-gamePlan', $scope.gamePlan);
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