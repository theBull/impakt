/// <reference path='../team-modals.mdl.ts' />
 
impakt.team.modals.controller('team.modals.deleteTeam.ctrl', 
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
		_team.deleteTeam($scope.team)
		.then(function(results) {
			$uibModalInstance.close(results);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);