/// <reference path='../planning.mdl.ts' />

impakt.planning.editor = angular.module('impakt.planning.editor', [
	'impakt.planning.editor.practicePlan'
]).config([
'$stateProvider',
function($stateProvider: any) {
	console.info('impakt.planning.editor – config');

	$stateProvider.state('planning.editor', {
		url: '/editor',
		templateUrl: 'modules/planning/editor/planning-editor.tpl.html',
		controller: 'planning.editor.ctrl'
	});
}])
.run(function() {
	console.info('impakt.planning.editor – run');
});