/// <reference path='./planning.mdl.ts' />

impakt.planning.controller('planning.ctrl', 
['$scope', '$state', '_planning', 
function($scope: any, $state: any, _planning: any) {

	// load up the browser by default
	$state.go('planning.browser');

}]);