/// <reference path='../team-modals.mdl.ts' />
 
impakt.team.modals.controller('team.modals.createTeam.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_team',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_team: any
) {

	$scope.newTeamModel = new Team.Models.TeamModel(Team.Enums.TeamTypes.Primary);
	$scope.teamTypes = Common.Utilities.convertEnumToList(Team.Enums.TeamTypes);

	$scope.ok = function () {
		
		_team.createTeam($scope.newTeamModel)
		.then(function(createdTeam: Team.Models.TeamModel) {
			$uibModalInstance.close(createdTeam);
		}, function(err) {
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);