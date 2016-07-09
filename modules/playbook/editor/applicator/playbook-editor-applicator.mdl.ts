/// <reference path='../playbook-editor.mdl.ts' />

impakt.playbook.editor.applicator = 
	angular.module('impakt.playbook.editor.applicator', [])
.config(function() {
	console.debug('impakt.playbook.editor.applicator - config');
})
.run(function() {
	console.debug('impakt.playbook.editor.applicator - run');
});