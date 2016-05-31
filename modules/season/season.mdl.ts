/// <reference path='../modules.mdl.ts' />
/// <reference path='./season.ts' />

impakt.season = angular.module('impakt.season', [
	'impakt.season.browser',
	'impakt.season.drilldown',
	'impakt.season.modals'
])
.config([
	'$stateProvider',
	'$urlRouterProvider',
	function(
		$stateProvider: any,
		$urlRouterProvider: any
	) {
		console.debug('impakt.season - config');

		// impakt module states
		$stateProvider.state('season', {
			url: '/season',
			templateUrl: 'modules/season/season.tpl.html',
			controller: 'season.ctrl'
		});

	}])
.run(function() {
	console.debug('impakt.season - run');
});