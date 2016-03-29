/// <reference path='../playbook-browser.mdl.ts' />

impakt.playbook.browser.main = angular.module('impakt.playbook.browser.main', [])
.config([
	'$stateProvider',
	function($stateProvider: any) {
	console.debug('impakt.playbook.browser.main - config');

}])
.run([function() {
	console.debug('impakt.playbook.browser.main - run');
}]);
	