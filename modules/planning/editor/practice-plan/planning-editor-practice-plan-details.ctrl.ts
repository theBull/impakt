/// <reference path='./planning-editor-practice-plan.mdl.ts' />

impakt.planning.editor.practicePlan.controller('planning.editor.practicePlan.details.ctrl', [
'$scope',
'_planningModals',
'_planningEditor',
function(
	$scope: any,
	_planningModals: any,
	_planningEditor: any
) {

	$scope.practicePlan = null;
	$scope.titleData = null;
	$scope.titleDataToggles = new Planning.Models.PlanningEditorToggleItemCollection();
	$scope.situationData = null;
	$scope.situationDataToggles = new Planning.Models.PlanningEditorToggleItemCollection();
	$scope.offensiveData = null;
	$scope.offensiveDataToggles = new Planning.Models.PlanningEditorToggleItemCollection();
	$scope.defensiveData = null;
	$scope.defensiveDataToggles = new Planning.Models.PlanningEditorToggleItemCollection();

	function init() {
		if(Common.Utilities.isNotNullOrUndefined(_planningEditor.currentTab)) {
			$scope.practicePlan = _planningEditor.currentTab.data;

			if(Common.Utilities.isNotNullOrUndefined($scope.practicePlan)) {
				$scope.titleData = $scope.practicePlan.titleData;
				$scope.situationData = $scope.practicePlan.situationData;
				$scope.offensiveData = $scope.practicePlan.offensiveData;
				$scope.defensiveData = $scope.practicePlan.defensiveData;
			}

			if(Common.Utilities.isNotNullOrUndefined($scope.titleData))
				$scope.titleDataToggles = $scope.titleData.toCollection();

			if (Common.Utilities.isNotNullOrUndefined($scope.situationData))
				$scope.situationDataToggles = $scope.situationData.toCollection();

			if (Common.Utilities.isNotNullOrUndefined($scope.offensiveData))
				$scope.offensiveDataToggles = $scope.offensiveData.toCollection();

			if (Common.Utilities.isNotNullOrUndefined($scope.defensiveData))
				$scope.defensiveDataToggles = $scope.defensiveData.toCollection();
		}
	}

	$scope.save = function() {
		_planningModals.savePracticePlan($scope.practicePlan);
	}

	init();

}]);