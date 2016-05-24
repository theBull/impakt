/// <reference path='../playbook-modals.mdl.ts' />
 
impakt.playbook.modals.controller('playbook.modals.createFormation.ctrl', 
['$scope', 
'$uibModalInstance',
'_associations',
'_playbook',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_playbook: any) {

	$scope.unitTypeCollection = impakt.context.Team.unitTypes;
	$scope.selectedUnitType = $scope.unitTypeCollection.getByUnitType(Team.Enums.UnitTypes.Offense).toJson();
	$scope.playbooks = impakt.context.Playbook.playbooks;
	$scope.play = new Common.Models.PlayPrimary($scope.selectedUnitType.unitType)
	$scope.play.formation = new Common.Models.Formation($scope.selectedUnitType.unitType);
	$scope.formations = impakt.context.Playbook.formations;
	$scope.selectedPlaybook = $scope.playbooks.first();

	/**
	 * Check to ensure there are formations to select as a base formation;
	 * Add a new empty formation if there are no others to select from
	 */
	$scope.formations.add($scope.play.formation);

	/** 
	 * If there are no other formations, the selected base formation
	 * will be the current, new formation
	 */
	$scope.selectedBaseFormation = $scope.play.formation;
	impakt.context.Playbook.creation.plays.add($scope.play);

	/**
	 * If there is a selected playbook available, add an association to
	 * the new formation to that playbook.
	 */
	if ($scope.selectedPlaybook) {
		// Add the currently selected playbook as an association to
		// this formation, by default
		//$scope.formation.associated.playbooks.only($scope.selectedPlaybook.guid);

		// add the new formation as an association to the currently
		// selected playbook, by default
		//$scope.selectedPlaybook.associated.formations.add($scope.formation.guid);
	}

	$scope.selectPlaybook = function(playbook: Common.Models.PlaybookModel) {
		// update the new formation associated playbook so that it only has 1 playbook
		// association, max, when creating it.
		//$scope.formation.associated.playbooks.only(playbook.guid);

		// Remove the formation from the currently selected playbook
		//$scope.selectedPlaybook.associated.formations.remove($scope.formation.guid);

		// Add the formation to the newly selected playbook
		$scope.selectedPlaybook = playbook;
	}

	$scope.selectBaseFormation = function(formation: Common.Models.Formation) {
		if($scope.selectedBaseFormation != '' && 
			Common.Utilities.isNotNullOrUndefined($scope.selectedBaseFormation)) {
			$scope.play.formation.setPlacements($scope.selectedBaseFormation.placements);
		}			
	}

	$scope.selectUnitType = function() {
		$scope.play.setUnitType($scope.selectedUnitType.unitType);
	}

	$scope.ok = function () {
        $scope.play.formation.parentRK = 1; // TODO @theBull - deprecate parentRK
		
		_playbook.createFormation($scope.play.formation)
		.then(function(createdFormation: Common.Models.Formation) {
			_associations.createAssociation(createdFormation, $scope.selectedPlaybook);
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
		if (Common.Utilities.isNotNullOrUndefined($scope.play.formation)) {
			impakt.context.Playbook.creation.formations.remove($scope.play.formation.guid);
		}
	}

	function removeFormationFromCollectionContext() {
		// Removes the formation from the formation collection context;
		// call this if you cancel / dismiss the dialog without invoking
		// the createFormation request, since the formation is temporarily
		// added to the formation collection in the situation where
		// there are 0 formations in the user's collection.
		if (Common.Utilities.isNotNullOrUndefined($scope.play.formation)) {
			$scope.formations.remove($scope.play.formation.guid);
		}
	}
}]);