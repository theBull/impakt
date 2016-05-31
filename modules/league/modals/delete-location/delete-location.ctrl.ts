/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.deleteLocation.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_league', 
'location',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_league: any, 
	location: any) {

	$scope.location = location;

	$scope.ok = function () {
		_league.deleteLocation($scope.location)
		.then(function(results) {
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