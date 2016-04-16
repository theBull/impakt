/// <reference path='./playbook-editor.mdl.ts' />

impakt.playbook.editor.controller('playbook.editor.ctrl',
[
'$scope', 
'$stateParams', 
'_playbookEditor',
function(
	$scope: any, 
	$stateParams: any, 
	_playbookEditor: any
) {

	$scope.canvas = _playbookEditor.canvas;
	_playbookEditor.init();

	var templatePrefix = 'modules/playbook/editor/';
	$scope.templates = {
		tools: [
			templatePrefix, 
			'tools/playbook-editor-tools.tpl.html'
		].join(''),
		tabs: [
			templatePrefix,
			'tabs/playbook-editor-tabs.tpl.html'
		].join(''),
		canvas: [
			templatePrefix,
			'canvas/playbook-editor-canvas.tpl.html'
		].join(''),
		mode: [
			templatePrefix,
			'mode/playbook-editor-mode.tpl.html'
		].join('')
	}				
	
}]);