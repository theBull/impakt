/// <reference path='./planning-drilldown.mdl.ts' />

impakt.planning.drilldown.controller('planning.drilldown.ctrl', [
'$scope', 
'_details',
'_planning',
function(
	$scope: any, 
	_details: any,
	_planning: any
) {

	$scope.drilldown = _planning.drilldown;

	$scope.toPlanDrilldown = function(plan: Planning.Models.Plan) {
		_planning.toPlanDrilldown(plan);
	}

	$scope.toBrowser = function() {
		_details.selectedElements.deselectAll();
		_planning.toBrowser();
	}

}]);