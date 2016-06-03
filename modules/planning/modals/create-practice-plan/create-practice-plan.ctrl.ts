/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.createPracticePlan.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_associations',
'_planning',
'plan',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_planning: any,
	plan: any
) {

	$scope.plans = impakt.context.Planning.plans;
	$scope.newPracticePlan = new Planning.Models.PracticePlan();
	$scope.selectedPlan = plan || null;
	
	$scope.selectPlan = function() {
		if (Common.Utilities.isNullOrUndefined($scope.selectedPlan))
			return;

		$scope.newPracticePlan.setPlan($scope.selectedPlan);
	}

	$scope.updateDatetime = function() {
		// TODO @theBull
	}

	$scope.ok = function () {
		
		_planning.createPracticePlan($scope.newPracticePlan)
		.then(function(createdPracticePlan: Planning.Models.PracticePlan) {

			let practicePlanAssociations = [];

			if (Common.Utilities.isNotNullOrUndefined($scope.selectedPlan))
				practicePlanAssociations.push($scope.selectedPlan);
			
			_associations.createAssociations(createdPracticePlan, practicePlanAssociations);
			removePracticePlanFromCreationContext();

			$uibModalInstance.close(createdPracticePlan);
		}, function(err) {
			removePracticePlanFromCreationContext();
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function() {
		removePracticePlanFromCreationContext();
		$uibModalInstance.dismiss();
	};

	function removePracticePlanFromCreationContext() {
		// Remove the practice plan from the creation context
		// after creating the new practice plan or cancelling
		if (Common.Utilities.isNotNullOrUndefined($scope.newPracticePlan))
			impakt.context.Planning.creation.practicePlans.remove($scope.newPracticePlan.guid);
	}
}]);