/// <reference path='./planning-editor-practice-plan.mdl.ts' />

impakt.planning.editor.practicePlan.controller('planning.editor.practicePlan.ctrl', [
'$scope',
'_planningEditor',
function(
	$scope: any,
	_planningEditor: any
) {

	$scope.practicePlan = null;
	$scope.hashmarkList = Common.Utilities.getEnumerationsOnly(Playbook.Enums.Hashmark);
	$scope.downs = [1, 2, 3, 4];
	$scope.fieldZones = Common.Utilities.getEnumerationsOnly(Playbook.Enums.FieldZones);
	$scope.tempos = Common.Utilities.getEnumerationsOnly(Planning.Enums.Tempo);
	$scope.locations = impakt.context.League.locations;
	$scope.opponents = impakt.context.Team.teams;
	$scope.plays = impakt.context.Playbook.plays;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.personnelCollection = impakt.context.Team.personnel;
	$scope.selectedLocation = null;
	$scope.selectedOpponent = null;

	function init() {
		if(Common.Utilities.isNotNullOrUndefined(_planningEditor.currentTab)) {
			$scope.practicePlan = _planningEditor.currentTab.data;
			if (Common.Utilities.isNotNullOrUndefined($scope.practicePlan) &&
				Common.Utilities.isNotNullOrUndefined($scope.practicePlan.titleData) &&
				Common.Utilities.isNotNullOrUndefined($scope.practicePlan.titleData.location)) {
				$scope.selectedLocation = $scope.practicePlan.titleData.location.location;
			}	
			if (Common.Utilities.isNotNullOrUndefined($scope.practicePlan) &&
				Common.Utilities.isNotNullOrUndefined($scope.practicePlan.titleData) &&
				Common.Utilities.isNotNullOrUndefined($scope.practicePlan.titleData.opponent)) {
				$scope.selectedOpponent = $scope.practicePlan.titleData.opponent.opponent;
			}	
		}
	}

	$scope.opponentSelected = function(practicePlan: Planning.Models.PracticePlan) {
		if (Common.Utilities.isNotNullOrUndefined(practicePlan) &&
			Common.Utilities.isNotNullOrUndefined(practicePlan.titleData) &&
			Common.Utilities.isNotNullOrUndefined(practicePlan.titleData.opponent)) {
			practicePlan.titleData.opponent.setOpponent($scope.selectedOpponent);
		}
	}

	$scope.locationSelected = function(practicePlan: Planning.Models.PracticePlan) {
		if(Common.Utilities.isNotNullOrUndefined(practicePlan) &&
			Common.Utilities.isNotNullOrUndefined(practicePlan.titleData) &&
			Common.Utilities.isNotNullOrUndefined(practicePlan.titleData.location)) {
			practicePlan.titleData.location.setLocation($scope.selectedLocation);
		}
	}

	init();

}]);