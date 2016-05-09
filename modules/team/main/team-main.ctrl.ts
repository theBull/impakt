/// <reference path='./team-main.mdl.ts' />

impakt.team.main.controller('team.main.ctrl', 
['$scope', '_team', '_teamModals',
function($scope: any, _team: any, _teamModals: any) {

	$scope.createTeam = function() {
		_teamModals.createTeam();
	}	
	
}]);