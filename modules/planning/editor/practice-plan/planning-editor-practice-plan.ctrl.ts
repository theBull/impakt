/// <reference path='./planning-editor-practice-plan.mdl.ts' />

impakt.planning.editor.practicePlan.controller('planning.editor.practicePlan.ctrl', [
'$scope',
'_planningEditor',
function(
	$scope: any,
	_planningEditor: any
) {

	$scope.practicePlan = null;

	function init() {
		if(Common.Utilities.isNotNullOrUndefined(_planningEditor.currentTab)) {
			$scope.practicePlan = _planningEditor.currentTab.data;
		}
	}

	init();

}]);