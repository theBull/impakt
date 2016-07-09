/// <reference path='./playbook-editor-tabs.mdl.ts' />
/// <reference path='../../../../common/common.ts' />

declare var impakt: any, angular: any;

impakt.playbook.editor.tabs.controller('playbook.editor.tabs.ctrl',
[
'$scope', 
'_base', 
'_playbookModals',
'_playbookEditor',
	function(
		$scope: any,
		_base: any, 
		_playbookModals: any,
		_playbookEditor: any) {

	$scope.tabs = _playbookEditor.tabs;

	$scope.getEditorTypeClass = function(editorType: any) {
		return _playbookEditor.getEditorTypeClass(parseInt(editorType));
	}

	$scope.new = function() {
		_playbookModals.openNewEditorTab();
	}

	$scope.close = function(tab: Common.Models.Tab) {
		let toClose = confirm('Are you sure you want to close?');
		
		if(toClose)
			_playbookEditor.closeTab(tab);
	}

	$scope.activate = function(tab: Common.Models.Tab) {
		_playbookEditor.activateTab(tab, true);
	}

	$scope.toBrowser = function() {
		_playbookEditor.toBrowser();
	}

}]);