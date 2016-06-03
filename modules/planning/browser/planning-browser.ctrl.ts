/// <reference path='./planning-browser.mdl.ts' />

impakt.planning.browser.controller('planning.browser.ctrl', [
'$scope', 
'_planning', 
'_planningModals',
function(
	$scope: any, 
	_planning: any, 
	_planningModals: any, 
	_teamModals: any
) {

	$scope.plans = impakt.context.Planning.plans;

	$scope.createPlan = function() {
		_planningModals.createPlan();
	}

	$scope.planDrilldown = function(plan: Planning.Models.Plan) {
		_planning.toPlanDrilldown(plan);
	}

}]);