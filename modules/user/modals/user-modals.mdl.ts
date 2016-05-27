/// <reference path='../user.mdl.ts' />

impakt.user.modals = angular.module('impakt.user.modals', [])
	.config(function() {
		console.debug('impakt.user.modals - config');
	})
	.run(function() {
		console.debug('impakt.user.modals - run');
	});