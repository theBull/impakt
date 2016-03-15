/// <reference path='../common.mdl.ts' />

/**
 * Defines a common base module for shared and inherited
 * components, such as base services and controllers.
 */
impakt.common.base = angular.module('impakt.common.base', [])
.config(function() {

	console.debug('impakt.common.base - config');
})
.run(function() {
	console.debug('impakt.common.base - run');
});

