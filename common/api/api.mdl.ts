/// <reference path='../common.mdl.ts' />


impakt.common.api = angular.module('impakt.common.api', 
	[]
)
.config([function() {
	console.debug('impakt.common.api - config');
}])
.run([function() {
	console.debug('impakt.common.api - run');
}]);