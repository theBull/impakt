/// <reference path='../playbook.mdl.ts' />
declare var impakt: any, angular: any;

impakt.playbook.layout = angular.module('impakt.playbook.layout', [])
.config(function() {
	console.debug('impakt.playbook.layout - config');
})
.run(function() {
	console.debug('impakt.playbook.layout - run');
});