/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.deleteLeague.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_league', 
'league',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_league: any, 
	league: any) {

	$scope.league = league;

	$scope.ok = function () {
		_league.deleteLeague($scope.league)
		.then(function(results) {
			$uibModalInstance.close(results);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};
}]);