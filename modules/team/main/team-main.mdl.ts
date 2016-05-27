/// <reference path='../team.mdl.ts' />

impakt.team.main = angular.module('impakt.team.main', [])
.config([function() {
	console.debug('impakt.team.main - config');
}])
.run(function() {
	console.debug('impakt.team.main - run');
});