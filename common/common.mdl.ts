/// <reference path='../js/impakt.ts' />
/// <reference path='./common.ts' />

impakt.common = angular.module('impakt.common', [
	'impakt.common.api',
	'impakt.common.auth',
	'impakt.common.contextmenu',
	'impakt.common.context',
	'impakt.common.base',
	'impakt.common.scrollable',
	'impakt.common.modals',
	'impakt.common.localStorage',
	'impakt.common.parser',
	'impakt.common.signin',
	'impakt.common.ui',
	'impakt.common.notifications'
])
.config(function() {
	console.debug('impakt.common - config');
})
.run(function() {
	console.debug('impakt.common - run');
});

