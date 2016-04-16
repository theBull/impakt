/// <reference path='../js/impakt.ts' />

impakt.modules = angular.module('impakt.modules', [
	'impakt.home',
	'impakt.season',
	'impakt.planning',
	'impakt.analysis',
	'impakt.playbook',
	'impakt.nav',
	'impakt.user',
	'impakt.search',
	'impakt.team'
])
.config(
['$stateProvider', '$urlRouterProvider',
function($stateProvider: any, $urlRouterProvider: any) {
	console.debug('impakt.modules - config');
}])
.run(function() {
	console.debug('impakt.modules - run');
});

