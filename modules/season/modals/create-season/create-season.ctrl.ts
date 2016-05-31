/// <reference path='../season-modals.mdl.ts' />
 
impakt.season.modals.controller('season.modals.createSeason.ctrl', 
[
'$scope',
'$timeout',
'$uibModalInstance', 
'_season',
function(
	$scope: any, 
	$timeout: any,
	$uibModalInstance: any, 
	_season: any
) {

	$scope.newSeasonModel = new Season.Models.SeasonModel();
	$scope.numberOfWeeks = 32;
	$scope.maxWeeks = 64;
	$scope.minWeeks = 1;
	$scope.debounce = null;
	var DEBOUNCE_DELAY = 500;


	function init() {
		for (let i = 0; i < $scope.numberOfWeeks; i++) {
			$scope.newSeasonModel.weeks.add(createWeek(i + 1), false);
		}
	}

	function createWeek(weekNumber: number): Season.Models.Week {
		let week = new Season.Models.Week();
		week.name = 'Week';
		week.number = weekNumber;
		week.incrementWeek($scope.newSeasonModel.start, $scope.newSeasonModel.weeks.size());
		return week;
	}

	$scope.setWeeks = function() {
		if (Common.Utilities.isNotNullOrUndefined($scope.debounce)) {
			// clear an existing timeout if exists, to debounce
			$timeout.cancel($scope.debounce);
		}

		$scope.debounce = $timeout(function() { 
			if (Common.Utilities.isNullOrUndefined($scope.numberOfWeeks) ||
				$scope.numberOfWeeks == '' || 
				isNaN($scope.numberOfWeeks) || 
				$scope.numberOfWeeks == 0)
				return;

			let sizeDiff = $scope.numberOfWeeks - $scope.newSeasonModel.weeks.size();
			if (sizeDiff == 0) {
				return;
			} else {

				if ($scope.numberOfWeeks > $scope.maxWeeks)
					$scope.numberOfWeeks = $scope.maxWeeks;
				if ($scope.numberOfWeeks < $scope.minWeeks)
					$scope.numberOfWeeks = $scope.minWeeks;

				$scope.newSeasonModel.weeks.listen(false);
				if (sizeDiff < 0) {
					while ($scope.newSeasonModel.weeks.size() > $scope.numberOfWeeks) {
						$scope.newSeasonModel.weeks.pop();
					}
				} else {
					while ($scope.newSeasonModel.weeks.size() < $scope.numberOfWeeks) {
						$scope.newSeasonModel.weeks.add(
							createWeek($scope.newSeasonModel.weeks.size() + 1)
						);
					}
				}
				$scope.newSeasonModel.weeks.listen(true);
			}
		}, DEBOUNCE_DELAY);
	}

	$scope.weekBlur = function() {
		$scope.numberOfWeeks = $scope.newSeasonModel.weeks.size();
	}

	$scope.updateDatetime = function() {
		let seasonStartDate = $scope.newSeasonModel.start.date;
		$scope.newSeasonModel.weeks.forEach(function(week: Season.Models.Week, index: number) {
			// update weeks with the start date, +7 days
			week.incrementWeek($scope.newSeasonModel.start, index);
		});
	}

	$scope.ok = function () {
		
		_season.createSeason($scope.newSeasonModel)
		.then(function(createdSeason: Season.Models.SeasonModel) {
			$uibModalInstance.close(createdSeason);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

	init();
}]);