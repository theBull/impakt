/// <reference path='./playbook-browser.mdl.ts' />

impakt.playbook.browser.controller('playbook.browser.ctrl', [
'$scope',
'__context',
'_details',
'_playbook',
'_playbookModals',
function(
	$scope: any, 
	__context: any,
	_details: any,
	_playbook: any, 
	_playbookModals: any
) {
	
	$scope.editor;
	$scope.playbooks;
	$scope.formations;
	$scope.plays;
	$scope.assignmentGroups;
	$scope.scenarios;
	
	_details.selectedPlay = null;

	__context.onReady(function() {
		$scope.editor = impakt.context.Playbook.editor;
		$scope.playbooks = impakt.context.Playbook.playbooks;
		$scope.formations = impakt.context.Playbook.formations;
		$scope.plays = impakt.context.Playbook.plays;
		$scope.assignmentGroups = impakt.context.Playbook.assignmentGroups;
		$scope.scenarios = impakt.context.Playbook.scenarios;
	});


	$scope.getEditorTypeClass = function(editorType: Playbook.Enums.EditorTypes) {
		return _playbook.getEditorTypeClass(editorType);
	}

	$scope.openEditor = function() {
		_playbook.toEditor();
	}

	$scope.createPlaybook = function() {
		_playbookModals.createPlaybook();
	}
	$scope.deletePlaybook = function(playbook: Common.Models.PlaybookModel) {
		_playbookModals.deletePlaybook(playbook).then(function(data) {
			// navigate back to the main browser view
			$scope.goToAll();
		}, function(err) {

		});
	}
	$scope.createScenario = function() {
		_playbookModals.createScenario();
	}
	$scope.createPlay = function() {
		_playbookModals.createPlay();
	}
	$scope.alertDataRequired = function(dataType: string) {
		if($scope.formations.isEmpty() && $scope.playbooks.hasElements()) {
			alert("Please create a base formation in order to begin creating " + dataType + ".");
		} else if($scope.playbooks.isEmpty()) {
			alert("Please create a playbook in order to begin creating " + dataType + ".");
		}
	}
	$scope.deletePlay = function(play: Common.Models.Play) {
		_playbookModals.deletePlay(play);
	}
	$scope.createFormation = function() {
		_playbookModals.createFormation();
	}
	$scope.deleteFormation = function(formation: Common.Models.Formation) {
		_playbookModals.deleteFormation(formation);
	}

	$scope.createAssignmentGroup = function() {
		// create default assignment group?
		//_playbookModals.createAssignmentGroup();
	}
	$scope.deleteAssignmentGroup = function(assignmentGroup: Common.Models.AssignmentGroup) {
		_playbookModals.deleteAssignmentGroup(assignmentGroup);
	}

	/**
	 *
	 * Item Drilldown
	 * 
	 */
	$scope.toPlaybookDrilldown = function(playbookModel: Common.Models.PlaybookModel) {
		_playbook.toPlaybookDrilldown(playbookModel);
	}

}]);