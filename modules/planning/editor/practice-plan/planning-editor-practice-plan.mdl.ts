/// <reference path='../planning-editor.mdl.ts' />

impakt.planning.editor.practicePlan = angular.module('impakt.planning.editor.practicePlan', [])
.config([
'$stateProvider',
function($stateProvider: any) {
	console.info('impakt.planning.editor.practicePlan – config');

	$stateProvider.state('planning.editor.practicePlan', {
		url: '/practicePlan',
		templateUrl: 'modules/planning/editor/practice-plan/planning-editor-practice-plan.tpl.html',
		controller: 'planning.editor.practicePlan.ctrl'
	});
}])
.run(function() {
	console.info('impakt.planning.editor.practicePlan – run');
});