/// <reference path='../league-modals.mdl.ts' />

impakt.league.modals.controller('league.modals.saveLeague.ctrl',
['$scope',
'$uibModalInstance',
'_league',
'league',
function(
	$scope: any,
	$uibModalInstance: any,
	_league: any,
	league: League.Models.LeagueModel
) {

	$scope.league = league;

	$scope.ok = function() {

		_league.updateLeague($scope.league)
			.then(function(savedLeague) {
				$uibModalInstance.close(savedLeague);
			}, function(err) {
				$uibModalInstance.close(err);
			});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

}]);