/// <reference path='../season-modals.mdl.ts' />

impakt.season.modals.controller('season.modals.saveSeason.ctrl',
['$scope',
'$uibModalInstance',
'_season',
'season',
function(
	$scope: any,
	$uibModalInstance: any,
	_season: any,
	season: Season.Models.SeasonModel
) {

	$scope.season = season;

	$scope.ok = function() {

		_season.updateSeason($scope.season)
			.then(function(savedSeason) {
				$uibModalInstance.close(savedSeason);
			}, function(err) {
				$uibModalInstance.close(err);
			});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

}]);