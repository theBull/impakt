/// <reference path='./playbook-drilldown-playbook.mdl.ts' />

impakt.playbook.drilldown.playbook.controller('playbook.drilldown.playbook.ctrl', [
'$scope',
'_associations',
'_playbook',
'_playbookModals',
function(
	$scope: any,
	_associations: any,
	_playbook: any,
	_playbookModals: any
) {

	$scope.playbook = _playbook.drilldown.playbook;
	$scope.plays;
	$scope.formations;

	function init() {
		let associations = _associations.getAssociated($scope.playbook);
		if(!Common.Utilities.isNullOrUndefined(associations)) {
			$scope.plays = associations.plays;
			$scope.formations = associations.formations;
		}
	}

	$scope.delete = function() {
		_playbookModals.deletePlaybook($scope.playbook);
	}

	init();
}]);