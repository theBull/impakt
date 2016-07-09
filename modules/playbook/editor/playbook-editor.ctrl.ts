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

	/**
	 * Note:
	 *
	 * Unlike in most services that invoke init() internally,
	 * the playbook editor must be initialized each time its UI
	 * is created (such as when navigating to the editor from another
	 * module). Since controllers are constructed along with the
	 * UI when navigating to a view, it is the prime way to
	 * ensure the service is initialized when the view loads.
	 */
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
		].join(''),
		applicator: [
			templatePrefix,
			'applicator/playbook-editor-applicator.tpl.html'
		].join('')
	}		

	$scope.toBrowser = function() {
		_playbookEditor.toBrowser();
	}		
	
}]);