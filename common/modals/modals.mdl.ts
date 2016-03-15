/// <reference path='../common.mdl.ts' />

impakt.common.modals = angular.module('impakt.common.modals',
	[]
)
	.config([function() {
		console.debug('impakt.common.modals - config');
	}])
	.run([function() {
		console.debug('impakt.common.modals - run');
	}]);