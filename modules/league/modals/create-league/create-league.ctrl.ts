/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.createLeague.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_league',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_league: any
) {

	$scope.newLeagueModel = new League.Models.LeagueModel();

	$scope.ok = function () {
		
		_league.createLeague($scope.newLeagueModel)
		.then(function(createdLeague: League.Models.LeagueModel) {
			$uibModalInstance.close(createdLeague);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);