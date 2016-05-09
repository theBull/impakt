/// <reference path='../modules.mdl.ts' />

impakt.sidebar = angular.module('impakt.sidebar', [
	'impakt.playbook.sidebar'
])
.config([
	'$stateProvider',
	function($stateProvider: any) {

	console.debug('impakt.sidebar - config');

}])
.run([function() {
	console.debug('impakt.sidebar - run');
}]);
	