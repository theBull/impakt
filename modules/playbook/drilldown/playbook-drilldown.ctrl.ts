/// <reference path='./playbook-drilldown.mdl.ts' />

impakt.playbook.drilldown.controller('playbook.drilldown.ctrl', [
'$scope', 
'_playbook',
function(
	$scope: any, 
	_playbook: any
) {

	$scope.playbook = null;

	function init() {
		if (Common.Utilities.isNotNullOrUndefined(_playbook.drilldown))
			$scope.playbook = _playbook.drilldown.playbook;
	}

	$scope.toBrowser = function() {
		_playbook.toBrowser();
	}

	init();

}]);