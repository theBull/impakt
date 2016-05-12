/// <reference path='../common.mdl.ts' />

impakt.common.ui = angular.module('impakt.common.ui', [
	'impakt.quotes'
])
.config([function() {
	console.debug('impakt.common.ui - config');
}])
.run([function() {
	console.debug('impakt.common.ui - run');
}]);