/// <reference path='../ui.mdl.ts' />

impakt.common.ui.quotes = angular.module('impakt.quotes', [])
.config([function() {
	console.debug('impakt.quotes - config');
}])
.run([function() {
	console.debug('impakt.quotes - run');
}]);