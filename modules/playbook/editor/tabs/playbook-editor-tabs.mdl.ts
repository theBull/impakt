/// <reference path='../playbook-editor.mdl.ts' />

declare var impakt: any, angular: any;

impakt.playbook.editor.tabs = 
angular.module('impakt.playbook.editor.tabs', [
	'impakt.playbook.editor.canvas'
])
.config(function() {
	console.debug('impakt.playbook.editor.tabs - config');
})
.run(function() {
	console.debug('impakt.playbook.editor.tabs - run');
});