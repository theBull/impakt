/// <reference path='../playbook.mdl.ts' />

declare var impakt: any, angular: any;

impakt.playbook.nav = angular.module('impakt.playbook.nav', [])
.config(function() {
	console.debug('impakt.playbook.nav - config');
})
.run(function() {
	console.debug('impakt.playbook.nav - run');
});