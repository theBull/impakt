/// <reference path='./team-unit-types.mdl.ts' />

impakt.team.unitTypes.controller('impakt.team.unitTypes.ctrl', [
	'$scope',
	'_team',
	function($scope: any, _team: any) {
		$scope.unitTypes = impakt.context.Playbook.unitTypes.toArray();
	}
]);