/// <reference path='./league.mdl.ts' />

impakt.league.controller('league.ctrl', 
['$scope', '$state', '_league', 
function($scope: any, $state: any, _league: any) {

	// load up the browser by default
	$state.go('league.browser');

}]);