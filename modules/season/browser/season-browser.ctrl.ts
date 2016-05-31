/// <reference path='./season-browser.mdl.ts' />

impakt.season.browser.controller('season.browser.ctrl', [
'$scope', 
'_season', 
'_seasonModals',
function(
	$scope: any, 
	_season: any, 
	_seasonModals: any
) {

	$scope.seasons = impakt.context.Season.seasons;


	// TODO @theBull - filter by year
	// TODO @theBull - filter by league
	// TODO @theBull - filter by week


	$scope.createSeason = function() {
		_seasonModals.createSeason();
	}

}]);