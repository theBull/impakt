/// <reference path='../js/impakt.ts' />

impakt.modules = angular.module('impakt.modules', [
	'impakt.main',
	'impakt.home',
	'impakt.league',
	'impakt.season',
	'impakt.planning',
	'impakt.analysis',
	'impakt.playbook',
	'impakt.nav',
	'impakt.user',
	'impakt.search',
	'impakt.team',
	'impakt.sidebar',
	'impakt.details'
])
.config(
['$stateProvider', '$urlRouterProvider',
function($stateProvider: any, $urlRouterProvider: any) {
	console.debug('impakt.modules - config');
}])
.run(function() {
	console.debug('impakt.modules - run');
});

