/// <reference path='./planning-editor.mdl.ts' />

impakt.planning.editor.controller('planning.editor.ctrl', [
'$scope',
'_planning',
'_planningEditor',
'_planningModals',
function(
	$scope: any,
	_planning: any,
	_planningEditor: any,
	_planningModals: any
) {

	$scope.tabs = _planningEditor.tabs;

	function init() {
		_planningEditor.init();
	}

	$scope.toPlanDrilldown = function() {
		_planning.toPlanDrilldown(_planning.drilldown.plan);
	}

	$scope.newTab = function() {
		_planningModals.newPlanningEditorTab();
	}

	init();

}]);