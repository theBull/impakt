/// <reference path='../../../../common/common.ts' />
/// <reference path='./playbook-editor-canvas.mdl.ts' />

declare var impakt: any;

impakt.playbook.editor.canvas.service('_playbookEditorCanvas',[
	'$rootScope', 
	'$timeout', 
	'_base', 
	'_contextmenu',
	'_playPreview',
	'_playbook',
	'_playbookEditor',
	function(
		$rootScope: any, 
		$timeout: any, 
		_base: any,
		_contextmenu: any, 
		_playPreview: any,
		_playbook: any,
		_playbookEditor: any
	) {
		console.debug('service: impakt.playbook.editor.canvas');

		var self = this;

		this.readyCallbacks = [function() { console.log('canvas ready'); }]

		this.component = new Common.Base.Component(
			'_playbookEditorCanvas',
			Common.Base.ComponentType.Service,
			[]
		);

}]);