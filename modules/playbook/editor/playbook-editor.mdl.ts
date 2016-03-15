/// <reference path='../playbook.mdl.ts' />
declare var impakt: any, playbook: any;

impakt.playbook.editor = angular.module('impakt.playbook.editor', 
	[
		'impakt.playbook.editor.tabs',
		'impakt.playbook.editor.tools',
		'impakt.playbook.editor.mode',
		'impakt.playbook.editor.canvas',
		'impakt.playbook.editor.details'
	])
.config([
	'$stateProvider',
	function($stateProvider: any) {
	
	console.debug('impakt.playbook.editor - config');

	$stateProvider.state('playbook.editor', {
		url: '/editor',
		views: {
			// Uses browser side bar for now
			'sidebar': {
				templateUrl: 'modules/playbook/browser/sidebar/playbook-browser-sidebar.tpl.html',
				controller: 'playbook.browser.sidebar.ctrl'
			},
			'main': {
				templateUrl: 'modules/playbook/editor/playbook-editor.tpl.html',
				controller: 'playbook.editor.ctrl'
			},
			'details': {
				templateUrl: 'modules/playbook/editor/details/playbook-editor-details.tpl.html',
				controller: 'playbook.editor.details.ctrl'
			}
		}
	});

}])
.run(function() {
	console.debug('impakt.playbook.editor - run');
});