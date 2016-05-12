/// <reference path='../modules.mdl.ts' />

impakt.main = angular.module('impakt.main', [])
.config([function() {
	console.debug('impakt.main - config');
}])
.run([function() {
	console.debug('impakt.main - run');
}]);

