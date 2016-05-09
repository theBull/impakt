/// <reference path='./playbook-drilldown.mdl.ts' />

impakt.playbook.drilldown.controller('playbook.drilldown.ctrl', [
'$scope', 
'_playbook',
function(
	$scope: any, 
	_playbook: any
) {

	$scope.toBrowser = function() {
		_playbook.toBrowser();
	}

}]);