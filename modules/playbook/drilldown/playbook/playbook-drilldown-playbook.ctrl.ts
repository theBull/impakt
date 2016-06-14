/// <reference path='./playbook-drilldown-playbook.mdl.ts' />

impakt.playbook.drilldown.playbook.controller('playbook.drilldown.playbook.ctrl', [
'$scope',
'$rootScope',
'_associations',
'_playbook',
'_playbookModals',
function(
	$scope: any,
	$rootScope: any,
	_associations: any,
	_playbook: any,
	_playbookModals: any
) {

	$scope.playbook = _playbook.drilldown.playbook;
	$scope.scenarios = impakt.context.Playbook.scenarios;
	$scope.plays = impakt.context.Playbook.plays;
	$scope.formations = impakt.context.Playbook.formations;
	$scope.assignmentGroups = impakt.context.Playbook.assignmentGroups;
	

	let deleteScenarioListener = $rootScope.$on('delete-scenario', function(e: any, scenario: Common.Models.Scenario) {
		$scope.scenarios.remove(scenario.guid);
	});
	let deletePlayListener = $rootScope.$on('delete-play', function(e: any, play: Common.Interfaces.IPlay) {
		$scope.plays.remove(play.guid);
	});
	let deleteFormationListener = $rootScope.$on('delete-formation', function(e: any, formation: Common.Models.Formation) {
		$scope.formations.remove(formation.guid);
	});
	let deleteAssignmentGroupListener = $rootScope.$on('delete-assignmentGroup', function(e: any, assignmentGroup: Common.Models.AssignmentGroup) {
		$scope.assignmentGroups.remove(assignmentGroup.guid);
	});

	let associationsUpdatedListener = $rootScope.$on('associations-updated', function(e: any) {
		init();
	});

	$scope.$on('$destroy', function() {
		deleteScenarioListener();
		deletePlayListener();
		deleteFormationListener();
		deleteAssignmentGroupListener();
		associationsUpdatedListener();
	});

	function init() {
		let associations = _associations.getAssociated($scope.playbook);
		if(Common.Utilities.isNotNullOrUndefined(associations)) {
			$scope.plays = associations.plays;
			$scope.formations = associations.formations;
			$scope.scenarios = associations.scenarios;
			$scope.assignmentGroups = associations.assignmentGroups;
		}
	}
	$scope.createScenario = function() {
		_playbookModals.createScenario();
	}
	$scope.createPlay = function() {
		_playbookModals.createPlay();
	}
	$scope.createFormation = function() {
		_playbookModals.createFormation();
	}
	$scope.createAssignmentGroup = function() {
		// create default assignment group?
		//_playbookModals.createAssignmentGroup();
	}

	$scope.alertDataRequired = function(dataType: string) {
		if ($scope.formations.isEmpty()) {
			alert("Please create a base formation in order to begin creating " + dataType + ".");
		}
	}

	init();
}]);