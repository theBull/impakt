/// <reference path='../common.mdl.ts' />

impakt.common.notifications = angular.module('impakt.common.notifications', [])
.config([function() {
	console.debug('impakt.common.notifications - config');
}])
.run([function() {
	console.debug('impakt.common.notifications - run');
}])