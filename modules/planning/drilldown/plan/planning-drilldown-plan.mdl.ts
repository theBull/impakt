/// <reference path='../planning-drilldown.mdl.ts' />

impakt.planning.drilldown.plan = angular.module('impakt.planning.drilldown.plan', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.planning.drilldown.plan - config');
		
	$stateProvider.state('planning.drilldown.plan', {
		url: '/plan',
		templateUrl: 'modules/planning/drilldown/plan/planning-drilldown-plan.tpl.html',
		controller: 'planning.drilldown.plan.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.planning.drilldown.plan - run');
});
