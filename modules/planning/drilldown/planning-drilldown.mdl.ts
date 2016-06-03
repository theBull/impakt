/// <reference path='../planning.mdl.ts' />

impakt.planning.drilldown = angular.module('impakt.planning.drilldown', [
	'impakt.planning.drilldown.plan'
])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.planning.drilldown - config');
	
	$stateProvider.state('planning.drilldown', {
		url: '/drilldown',
		templateUrl: 'modules/planning/drilldown/planning-drilldown.tpl.html',
		controller: 'planning.drilldown.ctrl'
	});
	
}])
.run(function() {
	console.debug('impakt.planning.drilldown - run');
});
