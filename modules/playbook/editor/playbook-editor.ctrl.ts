/// <reference path='./playbook-editor.mdl.ts' />

impakt.playbook.editor.controller('playbook.editor.ctrl',
[
'$scope', 
'$stateParams', 
'_playbookEditor',
'_playbookBrowser',
function(
	$scope: any, 
	$stateParams: any, 
	_playbookEditor: any,
	_playbookBrowser: any
) {

	_playbookEditor.initializeData = $stateParams.data;
	$scope.canvases = _playbookEditor.canvases;

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