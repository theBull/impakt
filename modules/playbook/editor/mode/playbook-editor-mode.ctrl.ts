/// <reference path='./playbook-editor-mode.mdl.ts' />

impakt.playbook.editor.mode.controller('playbook.editor.mode.ctrl',
[
'$scope',
'_playbookEditor',
function(
	$scope: any,
	_playbookEditor: any
) {

	$scope.canvas = _playbookEditor.canvas;
	
}]);