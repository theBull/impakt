/// <reference path='./playbook-editor-canvas.mdl.ts' />

declare var impakt: any, angular: any;

impakt.playbook.editor.canvas.controller('playbook.editor.canvas.ctrl', [
'$scope',
'$timeout',
'_playbookEditorCanvas',
function(
	$scope: any,
	$timeout: any,
	_playbookEditorCanvas: any
) {

	$scope.formations = _playbookEditorCanvas.formations;
	$scope.personnelCollection = _playbookEditorCanvas.personnelCollection;
	$scope.plays = _playbookEditorCanvas.plays;
	$scope.tab = _playbookEditorCanvas.getActiveTab();
	$scope.hasOpenTabs = $scope.tab != null;
	$scope.canvas = _playbookEditorCanvas.canvas;
	$scope.editorModeClass = '';

	// check if there are any open tabs; if not, hide the canvas and
	// clear the canvas data.
	if($scope.tab) {
		$scope.tab.onclose(function() {
			$scope.hasOpenTabs = _playbookEditorCanvas.hasTabs();
		});
		$scope.canvas.onready(function() {
			$scope.editorModeClass = $scope.getEditorTypeClass($scope.canvas.playPrimary.editorType);
			$scope.canvas.onModified(function() {
				$scope.editorModeClass = $scope.getEditorTypeClass($scope.canvas.playPrimary.editorType);
				$timeout(function() {
					console.log('timeout running');
					$scope.$apply();
				}, 1);					
			});
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
		$scope.tab.playPrimary.editorType = Playbook.Enums.EditorTypes.Play;
	}

	$scope.getEditorTypeClass = function(editorType: any) {
		return _playbookEditorCanvas.getEditorTypeClass(parseInt(editorType));
	}


	/**
	 * Toggle Formation / Personnel / Assignments
	 */
	$scope.applyFormation = function(formation: Common.Models.Formation) {
		console.log('apply formation to editor');
		_playbookEditorCanvas.applyPrimaryFormation(formation);
	}
	$scope.applyPersonnel = function(personnel: Team.Models.Personnel) {
		_playbookEditorCanvas.applyPrimaryPersonnel(personnel);
	}
	$scope.applyPlay = function(play: Common.Models.Play) {
		_playbookEditorCanvas.applyPrimaryPlay(play);
	}

	/**
	 * Determine whether to show quick formation dropdown. Should only
	 * be possible when in play- or formation-editing types.
	 * @param {Playbook.Enums.EditorTypes} editorType Editor type enum to
	 * determine which type of editor window we have open.
	 */
	$scope.isFormationVisible = function(editorType: Playbook.Enums.EditorTypes) {
		return editorType == Playbook.Enums.EditorTypes.Formation ||
			editorType == Playbook.Enums.EditorTypes.Play;
	}
	/**
	 * Personnel should be visible when setting assignments, since we need the
	 * mapping information of a personnel group to determine how assignments are
	 * paired with the players in the given formation.
	 * @param {Playbook.Enums.EditorTypes} editorType [description]
	 */
	$scope.isPersonnelVisible = function(editorType: Playbook.Enums.EditorTypes) {
		return editorType == Playbook.Enums.EditorTypes.Assignment ||
			editorType == Playbook.Enums.EditorTypes.Play;
	}
	$scope.isAssignmentVisible = function(editorType: Playbook.Enums.EditorTypes) {
		return editorType == Playbook.Enums.EditorTypes.Assignment ||
			editorType == Playbook.Enums.EditorTypes.Play;
	}

	$scope.toBrowser = function() {
		_playbookEditorCanvas.toBrowser();
	}
}]);