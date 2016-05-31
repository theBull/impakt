/// <reference path='../season-modals.mdl.ts' />
 
impakt.season.modals.controller('season.modals.createSeasonDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_season', 
'season',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_season: any, 
	season: any) {

	$scope.season = season;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);