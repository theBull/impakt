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
	$scope.formation.unitType = $scope.selectedUnitType;
	$scope.unitTypes = impakt.context.Team.unitTypes;

	$scope.selectedPlaybook = $scope.playbooks.first();

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

	$scope.unitTypeSelected = function() {
		$scope.formation.unitType = $scope.selectedUnitType;
	}

	$scope.ok = function () {
        $scope.formation.parentRK = 1; // TODO @theBull - deprecate parentRK
		_playbook.editFormation($scope.formation);
		$uibModalInstance.close();
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);