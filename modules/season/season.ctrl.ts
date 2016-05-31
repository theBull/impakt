/// <reference path='./season.mdl.ts' />

impakt.season.controller('season.ctrl', 
['$scope', '$state', '_season', 
function($scope: any, $state: any, _season: any) {

	// load up the browser by default
	$state.go('season.browser');

}]);