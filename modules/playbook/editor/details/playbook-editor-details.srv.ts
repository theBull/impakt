/// <reference path='./playbook-editor-details.mdl.ts' />

declare var impakt: any;

impakt.playbook.editor.details.service('_playbookEditorDetails',
[
'_playbookEditor',
function(_playbookEditor: any) {
	
	console.debug('service: impakt.playbook.browser');
	this.canvas = _playbookEditor.canvas;

	this.closeActiveTab = function() {
		_playbookEditor.closeTab(_playbookEditor.activeTab);
	}

}]);