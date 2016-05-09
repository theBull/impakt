/// <reference path='../modules.mdl.ts' />
/// <reference path='./team.ts' />

impakt.team = angular.module('impakt.team', [
	'impakt.team.personnel',
	'impakt.team.main',
	'impakt.team.unitTypes',
	'impakt.team.modals'
])
.config([function() {
	console.debug('impakt.team - config');
}])
.run(function() {
	console.debug('impakt.team - run');
});