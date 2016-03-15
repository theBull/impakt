/// <reference path='../common.mdl.ts' />

impakt.common.localStorage = angular.module('impakt.common.localStorage', [])
.config(function() {
	console.debug('impakt.common.localStorage - config');
})
.run(function() {
	console.debug('impakt.common.localStorage - run');
});