/// <reference path='../common.mdl.ts' />

impakt.common.ui = angular.module('impakt.common.ui', [])
.config([function() {
	console.debug('impakt.common.ui - config');
}])
.run([function() {
	console.debug('impakt.common.ui - run');
}]);