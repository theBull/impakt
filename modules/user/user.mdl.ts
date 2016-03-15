/// <reference path='../modules.mdl.ts' />

impakt.user = angular.module('impakt.user', [
	'impakt.user.login'
])
.config(function() {
	console.log('impakt.user -- config');
})
.run(function() {
	console.log('impakt.user -- run');
});	