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
	
	_playbookEditorCanvas.onready(function() {
		console.log('playbook.editor.canvas.ctrl ready');
	});

	console.debug('controller: playbook.editor.canvas');


	$scope.applyFormation = function(formation) {
		console.log('apply formation to editor');
		_playbookEditorCanvas.applyFormation(formation);
	}
	$scope.applyPersonnel = function(personnel) {
		_playbookEditorCanvas.applyPersonnel(personnel);
	}
	$scope.applyPlay = function(play) {
		_playbookEditorCanvas.applyPlay(play);
	}
}]);