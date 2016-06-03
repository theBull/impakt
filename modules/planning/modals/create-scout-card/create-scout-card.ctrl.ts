/// <reference path='../planning-modals.mdl.ts' />
 
impakt.planning.modals.controller('planning.modals.createScoutCard.ctrl', 
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
	$scope.newScoutCard = new Planning.Models.ScoutCard();
	$scope.selectedPlan = plan || null;
	
	$scope.selectPlan = function() {
		if (Common.Utilities.isNullOrUndefined($scope.selectedPlan))
			return;

		$scope.newScoutCard.setPlan($scope.selectedPlan);
	}

	$scope.updateDatetime = function() {
		// TODO @theBull
	}

	$scope.ok = function () {
		
		_planning.createScoutCard($scope.newScoutCard)
		.then(function(createdScoutCard: Planning.Models.ScoutCard) {

			let scoutCardAssociations = [];

			if (Common.Utilities.isNotNullOrUndefined($scope.selectedPlan))
				scoutCardAssociations.push($scope.selectedPlan);
			
			_associations.createAssociations(createdScoutCard, scoutCardAssociations);
			removeScoutCardFromCreationContext();

			$uibModalInstance.close(createdScoutCard);
		}, function(err) {
			removeScoutCardFromCreationContext();
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function() {
		removeScoutCardFromCreationContext();
		$uibModalInstance.dismiss();
	};

	function removeScoutCardFromCreationContext() {
		// Remove the scout card from the creation context
		// after creating the new scout card or cancelling
		if (Common.Utilities.isNotNullOrUndefined($scope.newScoutCard))
			impakt.context.Planning.creation.scoutCards.remove($scope.newScoutCard.guid);
	}
}]);