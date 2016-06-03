/// <reference path='../planning-modals.mdl.ts' />

impakt.planning.modals.controller('planning.modals.newPlanningEditorTab.ctrl', [
'$scope',
'$uibModalInstance',
'_planningEditor',
function(
	$scope: any,
	$uibModalInstance: any,
	_planningEditor: any
) {

	$scope.practicePlans = impakt.context.Planning.practicePlans;
	$scope.selectedPracticePlan = null;
	$scope.editPracticePlansVisible = true;

	$scope.editPracticePlan = function() {
		$scope.editPracticePlansVisible = true;
	}

	$scope.selectPracticePlan = function() {
		// TODO @theBull
	}

	$scope.ok = function() {
		_planningEditor.addTab($scope.selectedPracticePlan);
		$uibModalInstance.close();
	}

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	}

}]);