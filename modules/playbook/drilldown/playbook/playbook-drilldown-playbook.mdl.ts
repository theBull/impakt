/// <reference path='../playbook-drilldown.mdl.ts' />

impakt.playbook.drilldown.playbook = angular.module('impakt.playbook.drilldown.playbook', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.playbook.drilldown.playbook - config');
		
	$stateProvider.state('playbook.drilldown.playbook', {
		url: '/playbook',
		templateUrl: 'modules/playbook/drilldown/playbook/playbook-drilldown-playbook.tpl.html',
		controller: 'playbook.drilldown.playbook.ctrl'
	});

}])
.run(function() {
	console.debug('impakt.playbook.drilldown.playbook - run');
});
