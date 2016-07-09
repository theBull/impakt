/// <reference path='./playbook-editor-applicator.mdl.ts' />

impakt.playbook.editor.applicator.controller('playbook.editor.applicator.ctrl', [
'$scope',
'$timeout',
'_playbookEditor',
function(
	$scope: any,
	$timeout: any,
	_playbookEditor: any
) {

	let component = new Common.Base.Component(
		'playbook.editor.applicator.ctrl', 
		Common.Base.ComponentType.Controller
	);

	$scope.scenario = new Common.Models.Scenario();
	$scope.formations = impakt.context.Playbook.formations;
	$scope.personnelCollection = impakt.context.Team.personnel;
	$scope.assignmentGroups = impakt.context.Playbook.assignmentGroups;
	$scope.editorModeClass = '';	

	$scope.$on("$destroy", function() {
        
    });

	function init() {

		// TODO @theBull - implement unique callback naming for targeted un/binding of
		// event listeners on $destroy. Find all for ".onModified("
		impakt.context.Playbook.formations.onModified(function() {
			$scope.formations = impakt.context.Playbook.formations;
		});
		impakt.context.Team.personnel.onModified(function() {
			$scope.personnelCollection = impakt.context.Team.personnel;
		});
		impakt.context.Playbook.assignmentGroups.onModified(function() {
			$scope.assignmentGroups = impakt.context.Playbook.assignmentGroups;
		});

		if(Common.Utilities.isNullOrUndefined(_playbookEditor.canvas))
			return;

		if(_playbookEditor.canvas.state == Common.Enums.State.Ready) {
			onCanvasReady();
		} else {
			_playbookEditor.canvas.setListener('ready', onFieldLoad);
		}
		
		// Tell the editor service that the applicator ctrl is ready
		_playbookEditor.component.loadDependency(component);
	}

	function onCanvasReady() {
		if(Common.Utilities.isNullOrUndefined(_playbookEditor.canvas.field))
			return;

		onFieldLoad();
		_playbookEditor.canvas.field.clearListeners();
		_playbookEditor.canvas.field.setListener('onload', onFieldLoad, true);
		_playbookEditor.canvas.field.setListener('onclear', onFieldClear, true);
	}

	function onFieldLoad() {		
		if(_playbookEditor.canvas.field.state == Common.Enums.State.Ready) {
			$scope.scenario = _playbookEditor.canvas.field.scenario;

			if(Common.Utilities.isNullOrUndefined($scope.scenario))
				return;

			$scope.scenario.clearListeners();
			$scope.scenario.onModified(function() {				
				$timeout(function() {
					$scope.$apply();
				}, 1);					
			});
		}
	}

	function onFieldClear() {
		$scope.scenario = null;
	}

	/**
	 * Toggle Editor mode
	 */
	$scope.switchToPlayMode = function() {
		console.log('switch from formation mode to play mode', $scope.tab.scenario);
		$scope.tab.scenario.editorType = Playbook.Enums.EditorTypes.Play;
	}

	$scope.getEditorTypeClass = function(editorType: any) {
		return _playbookEditor.getEditorTypeClass(parseInt(editorType));
	}

	/**
	 * Toggle Formation / Personnel / Assignments
	 */
	$scope.applyFormation = function(formation: Common.Models.Formation, playType: Playbook.Enums.PlayTypes) {
		_playbookEditor.applyFormation(formation, playType);
	}
	$scope.applyPersonnel = function(personnel: Team.Models.Personnel, playType: Playbook.Enums.PlayTypes) {
		_playbookEditor.applyPersonnel(personnel, playType);
	}
	$scope.applyAssignmentGroup = function(assignmentGroup: Common.Models.AssignmentGroup, playType: Playbook.Enums.PlayTypes) {
		_playbookEditor.applyAssignmentGroup(assignmentGroup, playType);
	}
	$scope.flipScenario = function() {
		_playbookEditor.flipScenario();
	}

	$scope.isNameVisible = function() {
		return Common.Utilities.isNotNullOrUndefined($scope.scenario);
	}
	$scope.isUnitTypeVisible = function() {
		return Common.Utilities.isNotNullOrUndefined($scope.scenario);
	}

	/**
	 * Determine whether to show quick formation dropdown. Should only
	 * be possible when in play- or formation-editing types.
	 * @param {Playbook.Enums.EditorTypes} editorType Editor type enum to
	 * determine which type of editor window we have open.
	 */
	$scope.isFormationVisible = function() {

		if(Common.Utilities.isNullOrUndefined($scope.scenario))
			return false;
		
		let editorType = $scope.scenario.editorType;
		return editorType == Playbook.Enums.EditorTypes.Formation ||
			editorType == Playbook.Enums.EditorTypes.Play ||
			editorType == Playbook.Enums.EditorTypes.Scenario;
	}
	/**
	 * Personnel should be visible when setting assignments, since we need the
	 * mapping information of a personnel group to determine how assignments are
	 * paired with the players in the given formation.
	 * @param {Playbook.Enums.EditorTypes} editorType [description]
	 */
	$scope.isPersonnelVisible = function() {

		if(Common.Utilities.isNullOrUndefined($scope.scenario))
			return false;
		
		let editorType = $scope.scenario.editorType;
		return editorType == Playbook.Enums.EditorTypes.Assignment ||
			editorType == Playbook.Enums.EditorTypes.Play ||
			editorType == Playbook.Enums.EditorTypes.Scenario;
	}
	$scope.isAssignmentGroupsVisible = function() {

		if(Common.Utilities.isNullOrUndefined($scope.scenario))
			return false;
		
		let editorType = $scope.scenario.editorType;
		return editorType == Playbook.Enums.EditorTypes.Assignment ||
			editorType == Playbook.Enums.EditorTypes.Play ||
			editorType == Playbook.Enums.EditorTypes.Scenario;
	}
	$scope.isOpponentBarVisible = function() {

		if(Common.Utilities.isNullOrUndefined($scope.scenario))
			return false;
		
		let editorType = $scope.scenario.editorType;
		return editorType == Playbook.Enums.EditorTypes.Scenario;
	}

	$scope.toBrowser = function() {
		_playbookEditor.toBrowser();
	}

	init();

}]);