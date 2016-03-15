/// <reference path='../playbook.mdl.ts' />

impakt.playbook.browser = angular.module('impakt.playbook.browser', [])
.config(function() {
	console.debug('impakt.playbook.browser - config');
})
.run(function() {
	console.debug('impakt.playbook.browser - run');
});