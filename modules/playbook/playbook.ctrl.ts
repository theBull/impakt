/// <reference path='./playbook.mdl.ts' />

impakt.playbook.controller('playbook.ctrl', 
['$scope', '$state', '$stateParams', '_playbook', 
function($scope: any, $state: any, $stateParams: any, _playbook: any) {

	// load up the browser by default
	$state.go('playbook.browser');

}]);