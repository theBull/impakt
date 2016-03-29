/// <reference path='../modules.mdl.ts' />

impakt.modules = angular.module('impakt.season', [])
.config(
[function() {
	console.debug('impakt.season - config');
}])
.run(function() {
	console.debug('impakt.season - run');
});
