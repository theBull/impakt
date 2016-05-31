/// <reference path='./season-drilldown.mdl.ts' />

impakt.season.drilldown.controller('season.drilldown.ctrl', [
'$scope', 
'_details',
'_season',
function(
	$scope: any, 
	_details: any,
	_season: any
) {

	$scope.drilldown = _season.drilldown;

	$scope.toSeasonDrilldown = function(season: Season.Models.SeasonModel) {
		_season.toSeasonDrilldown(season);
	}

	$scope.toWeekDrilldown = function(week: Season.Models.Week) {
		_season.toWeekDrilldown(week);
	}

	$scope.toBrowser = function() {
		_details.selectedElements.deselectAll();
		_season.toBrowser();
	}

}]);