/// <reference path='../playbook-browser-main.mdl.ts' />

impakt.playbook.browser.main.controller('playbook.browser.playbook.ctrl', [
'$scope',
function(
	$scope: any
) {

	$scope.playbook = $scope.template.data;

	$scope.associatedFormationCollection = new Common.Models.FormationCollection();
	$scope.associatedPlayCollection = new Common.Models.PlayCollection();

	function init() {
		$scope.playbook.associated.formations.forEach(function(formationGuid: string, index: number) {
			let matchingFormation = impakt.context.Playbook.formations.get(formationGuid);
			if (!Common.Utilities.isNullOrUndefined(matchingFormation))
			$scope.associatedFormationCollection.add(matchingFormation);
		});
		$scope.playbook.associated.plays.forEach(function(playGuid: string, index: number) {
			let matchingPlay = impakt.context.Playbook.formations.get(playGuid);
			if(!Common.Utilities.isNullOrUndefined(matchingPlay))
				$scope.associatedFormationCollection.add(matchingPlay);
		});
	}

	init();
}]);