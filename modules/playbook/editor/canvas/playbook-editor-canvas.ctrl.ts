/// <reference path='./playbook-editor-canvas.mdl.ts' />

declare var impakt: any, angular: any;

impakt.playbook.editor.canvas.controller('playbook.editor.canvas.ctrl', [
'$scope',
'_playbookEditorCanvas',
function(
	$scope: any,
	_playbookEditorCanvas: any
) {

	$scope.formations = _playbookEditorCanvas.formations;
	$scope.personnelCollection = _playbookEditorCanvas.personnelCollection;
	$scope.plays = _playbookEditorCanvas.plays;
	$scope.tab = _playbookEditorCanvas.getActiveTab();
	$scope.hasOpenTabs = $scope.tab != null;

	// check if there are any open tabs; if not, hide the canvas and
	// clear the canvas data.
	if($scope.tab) {
		$scope.tab.onclose(function() {
			$scope.hasOpenTabs = _playbookEditorCanvas.hasTabs();
		});
	}

	// _playbookEditorCanvas.onready(function() {
	// 	$scope.tab = _playbookEditorCanvas.activeTab;
	// });	

	$scope.formations.onModified(function() {
		// $scope.$apply();
	});


	/**
	 * Toggle Editor mode
	 */
	$scope.switchToPlayMode = function() {
		console.log('switch from formation mode to play mode', $scope.tab.playPrimary);
		$scope.tab.playPrimary.editorType = Playbook.Editor.EditorTypes.Play;
	}

	$scope.getEditorTypeClass = function(editorType: any) {
		return _playbookEditorCanvas.getEditorTypeClass(parseInt(editorType));
	}


	/**
	 * Toggle Formation / Personnel / Assignments
	 */
	$scope.applyFormation = function(formation: Playbook.Models.Formation) {
		console.log('apply formation to editor');
		_playbookEditorCanvas.applyPrimaryFormation(formation);
	}
	$scope.applyPersonnel = function(personnel: Playbook.Models.Personnel) {
		_playbookEditorCanvas.applyPrimaryPersonnel(personnel);
	}
	$scope.applyPlay = function(play: Playbook.Models.Play) {
		_playbookEditorCanvas.applyPrimaryPlay(play);
	}

	/**
	 * Determine whether to show quick formation dropdown. Should only
	 * be possible when in play- or formation-editing types.
	 * @param {Playbook.Editor.EditorTypes} editorType Editor type enum to
	 * determine which type of editor window we have open.
	 */
	$scope.isFormationVisible = function(editorType: Playbook.Editor.EditorTypes) {
		return editorType == Playbook.Editor.EditorTypes.Formation ||
			editorType == Playbook.Editor.EditorTypes.Play;
	}
	/**
	 * Personnel should be visible when setting assignments, since we need the
	 * mapping information of a personnel group to determine how assignments are
	 * paired with the players in the given formation.
	 * @param {Playbook.Editor.EditorTypes} editorType [description]
	 */
	$scope.isPersonnelVisible = function(editorType: Playbook.Editor.EditorTypes) {
		return editorType == Playbook.Editor.EditorTypes.Assignment ||
			editorType == Playbook.Editor.EditorTypes.Play;
	}
	$scope.isAssignmentVisible = function(editorType: Playbook.Editor.EditorTypes) {
		return editorType == Playbook.Editor.EditorTypes.Assignment ||
			editorType == Playbook.Editor.EditorTypes.Play;
	}

	$scope.toBrowser = function() {
		_playbookEditorCanvas.toBrowser();
	}
}]);