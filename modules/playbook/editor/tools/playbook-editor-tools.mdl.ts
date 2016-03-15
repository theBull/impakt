/// <reference path='../playbook-editor.mdl.ts' />

declare var impakt: any, angular: any;

impakt.playbook.editor.tools =
angular.module('impakt.playbook.editor.tools', [])
.config(function() {
	console.debug('impakt.playbook.editor.tools - config');
})
.run(function() {
	console.debug('impakt.playbook.editor.tools - run');
});