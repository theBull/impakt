/// <reference path='../team.mdl.ts' />

impakt.team.personnel = angular.module('impakt.team.personnel', [
	'impakt.team.personnel.create'
])
.config([function() {
	console.debug('impakt.team.create -- config');
}])
.run([function() {
	console.debug('impakt.team.create -- run');
}]);