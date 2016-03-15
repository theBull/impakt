/// <reference path='./playbook-editor-tabs.mdl.ts' />
/// <reference path='../../models/canvas/Canvas.ts' />
/// <reference path='../../../../common/common.ts' />
/// <reference path='../../playbook.ts' />

declare var impakt: any, angular: any;

impakt.playbook.editor.tabs.controller('playbook.editor.tabs.ctrl',
[
'$scope', 
'_base', 
'_playbookModals',
'_playbookEditorTabs',
	function(
		$scope: any,
		_base: any, 
		_playbookModals: any,
		_playbookEditorTabs: any) {

	this.component = new Common.Base.Component(
		'playbook.editor.tabs.ctrl', 
		Common.Base.ComponentType.Controller
	);
	function init(self) {
		_playbookEditorTabs.component.loadDependency(self.component);
	}

	$scope.tabs = _playbookEditorTabs.tabs;

	$scope.getEditorTypeClass = function(editorType: any) {
		return _playbookEditorTabs.getEditorTypeClass(parseInt(editorType));
	}

	$scope.new = function() {
		_playbookModals.openNewEditorTab();
	}

	$scope.close = function(tab: Playbook.Models.Tab) {
		let toClose = confirm('Are you sure you want to close?');
		
		if(toClose)
			_playbookEditorTabs.close(tab);
	}

	$scope.activate = function(tab: Playbook.Models.Tab) {
		_playbookEditorTabs.activate(tab, true);
	}

	$scope.toBrowser = function() {
		_playbookEditorTabs.toBrowser();
	}

	init(this);

}]);