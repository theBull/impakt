/// <reference path='../modules.mdl.ts' />

impakt.nav = angular.module('impakt.nav', [
	'impakt.user',
	'impakt.playbook.nav'
])
.config(function() {
	console.debug('impakt.nav - config');
})
.run(function() {
	console.debug('impakt.nav - run');
});