/// <reference path='../modules.mdl.ts' />

impakt.modules = angular.module('impakt.planning', [])
.config(
[function() {
	console.debug('impakt.planning - config');
}])
.run(function() {
	console.debug('impakt.planning - run');
});
