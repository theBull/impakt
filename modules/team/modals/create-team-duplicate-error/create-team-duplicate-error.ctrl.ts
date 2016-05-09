/// <reference path='../team-modals.mdl.ts' />
 
impakt.team.modals.controller('team.modals.createTeamDuplicateError.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_team', 
'team',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_team: any, 
	team: any) {

	$scope.team = team;

	$scope.ok = function () {
		$uibModalInstance.close();		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);