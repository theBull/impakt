/// <reference path='../playbook.mdl.ts' />
declare var impakt: any, playbook: any;

impakt.playbook.editor = angular.module('impakt.playbook.editor', 
	[
		'impakt.playbook.editor.tabs',
		'impakt.playbook.editor.tools',
		'impakt.playbook.editor.mode',
		'impakt.playbook.editor.canvas'
	])
.config(function() {
	console.debug('impakt.playbook.editor - config');
})
.run(function() {
	console.debug('impakt.playbook.editor - run');
});