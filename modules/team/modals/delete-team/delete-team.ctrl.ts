/// <reference path='../team-modals.mdl.ts' />
 
impakt.team.modals.controller('team.modals.deleteTeam.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_team', 
'_league',
'team',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_team: any,
	_league: any,
	team: any
) {

	$scope.team = team;

	$scope.ok = function () {
		_team.deleteTeam($scope.team)
		.then(function(results) {
			$rootScope.$broadcast('delete-team', $scope.team);
			$uibModalInstance.close(results);
		}, function(err) {
			$uibModalInstance.close(err);
		});
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);