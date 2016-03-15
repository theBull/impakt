/// <reference path='./playbook-details.mdl.ts' />

impakt.playbook.details.controller('playbook.details.ctrl', 
['$scope', '__modals', '_playbookDetails', 
function($scope: any, __modals: any, _playbookDetails: any) {
	
	$scope.isCollapsed = true;

	_playbookDetails.ontoggle(function(isCollapsed) {
		$scope.isCollapsed = isCollapsed;
	});

	$scope.toggle = function() {
		_playbookDetails.toggle();
	}

	$scope.toggleUnitType = function(unitType) {
		console.log('toggle playbook type', unitType);
		_playbookDetails.toggleUnitType(unitType);
	}

	$scope.togglePlaybook = function(playbook) {
		console.log('toggle playbook key', playbook);
		_playbookDetails.togglePlaybook(playbook);
	}

}]);