/// <reference path='../playbook.mdl.ts' />

impakt.playbook.drilldown = angular.module('impakt.playbook.drilldown', [
	'impakt.playbook.drilldown.playbook'
]).config([
'$stateProvider',
function(
	$stateProvider: any
) {	
	
	console.debug('impakt.playbook.drilldown - config');

	$stateProvider.state('playbook.drilldown', {
		url: '/drilldown',
		templateUrl: 'modules/playbook/drilldown/playbook-drilldown.tpl.html',
		controller: 'playbook.drilldown.ctrl'
	});
}])
.run(function() {
	console.debug('impakt.playbook.drilldown - run');
});