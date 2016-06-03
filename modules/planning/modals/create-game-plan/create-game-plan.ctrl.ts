/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.createGamePlan.ctrl', 
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
	$scope.newGamePlan = new Planning.Models.GamePlan();
	$scope.selectedPlan = plan || null;
	
	$scope.selectPlan = function() {
		if (Common.Utilities.isNullOrUndefined($scope.selectedPlan))
			return;

		$scope.newGamePlan.setPlan($scope.selectedPlan);
	}

	$scope.updateDatetime = function() {
		// TODO @theBull
	}

	$scope.ok = function () {
		
		_planning.createGamePlan($scope.newGamePlan)
		.then(function(createdGamePlan: Planning.Models.GamePlan) {

			let gamePlanAssociations = [];

			if (Common.Utilities.isNotNullOrUndefined($scope.selectedPlan))
				gamePlanAssociations.push($scope.selectedPlan);
			
			_associations.createAssociations(createdGamePlan, gamePlanAssociations);
			removeGamePlanFromCreationContext();

			$uibModalInstance.close(createdGamePlan);
		}, function(err) {
			removeGamePlanFromCreationContext();
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function() {
		removeGamePlanFromCreationContext();
		$uibModalInstance.dismiss();
	};

	function removeGamePlanFromCreationContext() {
		// Remove the game plan from the creation context
		// after creating the new game plan or cancelling
		if (Common.Utilities.isNotNullOrUndefined($scope.newGamePlan))
			impakt.context.Planning.creation.gamePlans.remove($scope.newGamePlan.guid);
	}
}]);