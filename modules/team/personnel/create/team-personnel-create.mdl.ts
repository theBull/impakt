/// <reference path='../team-personnel.mdl.ts' />

impakt.team.personnel.create = angular.module('impakt.team.personnel.create', [])
.config([function() {
	console.debug('impakt.team.create -- config');
}])
.run([function() {
	console.debug('impakt.team.create -- run');
}]);