/// <reference path='../common.mdl.ts' />

impakt.common.scrollable = angular.module('impakt.common.scrollable', [])
	.config(function() {

		console.debug('impakt.common.scrollable - config');
	})
	.run(function() {
		console.debug('impakt.common.scrollable - run');
	});
