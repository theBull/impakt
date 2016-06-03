/// <reference path='../modules.mdl.ts' />
/// <reference path='./planning.ts' />

impakt.planning = angular.module('impakt.planning', [
	'impakt.planning.browser',
	'impakt.planning.editor',
	'impakt.planning.drilldown',
	'impakt.planning.modals'
])
.config([
'$stateProvider',
'$urlRouterProvider',
function(
	$stateProvider: any,
	$urlRouterProvider: any
) {
	console.debug('impakt.planning - config');

	// impakt module states
	$stateProvider.state('planning', {
		url: '/planning', 
		templateUrl: 'modules/planning/planning.tpl.html',
		controller: 'planning.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.planning - run');
});
