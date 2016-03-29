/// <reference path='../user.mdl.ts' />

impakt.user.login = angular.module('impakt.user.login', [])
.config(function() {
	console.debug('impakt.user.login - config');
})
.run(function() {
	console.debug('impakt.user.login - run');
});