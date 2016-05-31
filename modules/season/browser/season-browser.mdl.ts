/// <reference path='../season.mdl.ts' />

impakt.season.browser = angular.module('impakt.season.browser', [])
.config([
'$stateProvider',
function(
	$stateProvider: any
) {
	console.debug('impakt.season.browser - config');
	
	$stateProvider.state('season.browser', {
		url: '/browser',
		templateUrl: 'modules/season/browser/season-browser.tpl.html',
		controller: 'season.browser.ctrl'
	});
}])
.run(function() {
	console.debug('impakt.season.browser - run');
});
