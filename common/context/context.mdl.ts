/// <reference path='../common.mdl.ts' />

impakt.common.context = angular.module('impakt.common.context', 
	[]
)
.config([function() {
	console.debug('impakt.common.context - config');
}])
.run([function() {
	console.debug('impakt.common.context - run');
}]);