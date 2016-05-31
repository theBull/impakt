/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.createLocationDuplicateError.ctrl', 
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
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);