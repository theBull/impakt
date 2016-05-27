/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.deleteDivision.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_league', 
'division',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_league: any, 
	division: any) {

	$scope.division = division;

	$scope.ok = function () {
		_league.deleteDivision($scope.division)
		.then(function(results) {
			$rootScope.$broadcast('delete-division', $scope.division);
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