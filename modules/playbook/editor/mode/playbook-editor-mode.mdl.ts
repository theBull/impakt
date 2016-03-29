/// <reference path='../playbook-editor.mdl.ts' />

impakt.playbook.editor.mode = angular.module('impakt.playbook.editor.mode', [])
.config(function() {
	console.debug('impakt.playbook.editor.mode - config');
})
.run(function() {
	console.debug('impakt.playbook.editor.mode - run');
});