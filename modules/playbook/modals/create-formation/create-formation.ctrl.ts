/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createFormation.ctrl', 
['$scope', 
'$uibModalInstance', 
'_playbook',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_playbook: any) {

	$scope.selectedUnitType = Team.Enums.UnitTypes.Offense;
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.formation = new Common.Models.Formation();
	$scope.formations = impakt.context.Playbook.formations;
	$scope.formation.unitType = $scope.selectedUnitType;
	$scope.unitTypes = impakt.context.Team.unitTypes;
	$scope.selectedPlaybook = $scope.playbooks.first();

	/**
	 * Check to ensure there are formations to select as a base formation;
	 * Add a new empty formation if there are no others to select from
	 */
	$scope.formations.add($scope.formation);

	/** 
	 * If there are no other formations, the selected base formation
	 * will be the current, new formation
	 */
	$scope.selectedBaseFormation = $scope.formations.first();
	impakt.context.Playbook.creation.formations.add($scope.formation);

	/**
	 * If there is a selected playbook available, add an association to
	 * the new formation to that playbook.
	 */
	if ($scope.selectedPlaybook) {
		// Add the currently selected playbook as an association to
		// this formation, by default
		$scope.formation.associated.playbooks.only($scope.selectedPlaybook.guid);

		// add the new formation as an association to the currently
		// selected playbook, by default
		$scope.selectedPlaybook.associated.formations.add($scope.formation.guid);
	}

	$scope.selectPlaybook = function(playbook: Common.Models.PlaybookModel) {
		// update the new formation associated playbook so that it only has 1 playbook
		// association, max, when creating it.
		$scope.formation.associated.playbooks.only(playbook.guid);

		// Remove the formation from the currently selected playbook
		$scope.selectedPlaybook.associated.formations.remove($scope.formation.guid);

		// Add the formation to the newly selected playbook
		$scope.selectedPlaybook = playbook;
	}

	$scope.selectBaseFormation = function(formation: Common.Models.Formation) {
		if($scope.selectedBaseFormation != '' && 
			!Common.Utilities.isNullOrUndefined($scope.selectedBaseFormation)) {
			$scope.formation.setPlacements($scope.selectedBaseFormation.placements);
		}			
	}

	$scope.unitTypeSelected = function() {
		$scope.formation.unitType = $scope.selectedUnitType;
	}

	$scope.ok = function () {
        $scope.formation.parentRK = 1; // TODO @theBull - deprecate parentRK
		
		_playbook.createFormation($scope.formation)
		.then(function(createdFormation: Common.Models.Formation) {
			removeFormationFromCreationContext();
			$uibModalInstance.close(createdFormation);
		}, function(err: any) {
			removeFormationFromCreationContext();
		removeFormationFromCollectionContext();
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		removeFormationFromCreationContext();
		removeFormationFromCollectionContext();
		$uibModalInstance.dismiss();
	};

	function removeFormationFromCreationContext() {
		// Remove the formation from the creation context
		// after creating the new formation or cancelling
		if (!Common.Utilities.isNullOrUndefined($scope.formation)) {
			impakt.context.Playbook.creation.formations.remove($scope.formation.guid);
		}
	}

	function removeFormationFromCollectionContext() {
		// Removes the formation from the formation collection context;
		// call this if you cancel / dismiss the dialog without invoking
		// the createFormation request, since the formation is temporarily
		// added to the formation collection in the situation where
		// there are 0 formations in the user's collection.
		if (!Common.Utilities.isNullOrUndefined($scope.formation)) {
			$scope.formations.remove($scope.formation.guid);
		}
	}
}]);