/// <reference path='../playbook-editor.mdl.ts' />

impakt.playbook.editor.canvas = 
	angular.module('impakt.playbook.editor.canvas', [])
.config(function() {
	console.debug('impakt.playbook.editor.canvas - config');
})
.run(function() {
	console.debug('impakt.playbook.editor.canvas - run');
});