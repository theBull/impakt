/// <reference path='../modules.mdl.ts' />

impakt.nav = angular.module('impakt.nav', [
	'impakt.user',
	'impakt.playbook.nav'
])
.config(function() {
	console.log('nav - config');
})
.run(function() {
	console.log('nav - run');
});