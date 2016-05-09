/// <reference path='./league-drilldown.mdl.ts' />

impakt.league.drilldown.controller('league.drilldown.ctrl', [
'$scope', 
'_league',
function(
	$scope: any, 
	_league: any
) {

	$scope.toBrowser = function() {
		_league.toBrowser();
	}

}]);