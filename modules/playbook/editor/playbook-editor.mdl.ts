/// <reference path='../playbook.mdl.ts' />
declare var impakt: any, playbook: any;

impakt.playbook.editor = angular.module('impakt.playbook.editor', 
	[
		'impakt.playbook.editor.tabs',
		'impakt.playbook.editor.tools',
		'impakt.playbook.editor.mode',
		'impakt.playbook.editor.canvas',
		'impakt.playbook.editor.details',
		'impakt.playbook.editor.applicator'
	])
.config([
	'$stateProvider',
	function($stateProvider: any) {
	
	console.debug('impakt.playbook.editor - config');

	$stateProvider.state('playbook.editor', {
		url: '/editor',
		templateUrl: 'modules/playbook/editor/playbook-editor.tpl.html',
		controller: 'playbook.editor.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.playbook.editor - run');
});