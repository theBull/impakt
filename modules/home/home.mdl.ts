/// <reference path='../modules.mdl.ts' />

impakt.home = angular.module('impakt.home', [])
.config(
[function() {
	console.debug('impakt.home - config');
}])
.run(function() {
	console.debug('impakt.home - run');
});
