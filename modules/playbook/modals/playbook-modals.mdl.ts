/// <reference path='../playbook.mdl.ts' />

impakt.playbook.modals = angular.module('impakt.playbook.modals', [])
	.config(function() {
		console.debug('impakt.playbook.modals - config');
	})
	.run(function() {
		console.debug('impakt.playbook.modals - run');
	});