/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tabs.mdl.ts' />

impakt.playbook.editor.tabs.service('_playbookEditorTabs',
['$rootScope', 
'_base', 
'_playbookEditor', 
function(
	$rootScope: any,
	_base: any, 
	_playbookEditor: any) {
	
	console.debug('service: impakt.playbook.editor.tabs')
	
	let self = this;
	
	this.tabs = _playbookEditor.tabs;
	this.canvases = _playbookEditor.canvases;

	this.component = new Common.Base.Component(
		'_playbookEditorTabs',
		Common.Base.ComponentType.Service,
		[
			'playbook.editor.tabs.ctrl'
		]
	);

	function init() {
		_playbookEditor.component.loadDependency(self.component);
	}

	this.openNew = function() {						
		// Step 2: build a generic model from that response
		_playbookEditor.addTab(new Common.Models.Play());
	}

	this.close = function(tab: Common.Models.Tab) {
		// remove the tab from the array			
		_playbookEditor.closeTab(tab);
	}

	this.activate = function(tab: Common.Models.Tab, activateCanvas: boolean) {
		if(!tab.active)
			_playbookEditor.activateTab(tab, true);
	}

	this.toBrowser = function() {
		_playbookEditor.toBrowser();
	}

	this.getEditorTypeClass = function(editorType: Playbook.Enums.EditorTypes) {
		return _playbookEditor.getEditorTypeClass(editorType);
	}

	this.editFormation = function(formation: Common.Models.Formation) {
		_playbookEditor.editFormation(formation);
        $rootScope.$broadcast('playbook-editor.loadTabs');
	}

	this.editPlay = function(play: Common.Models.Play) {
		_playbookEditor.editPlay(play);
        $rootScope.$broadcast('playbook-editor.loadTabs');
	}

	init();

}]);