/// <reference path='../season-modals.mdl.ts' />
 
impakt.season.modals.controller('season.modals.deleteSeason.ctrl', 
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
		_season.deleteSeason($scope.season)
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