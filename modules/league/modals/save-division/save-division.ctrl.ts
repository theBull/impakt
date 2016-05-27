/// <reference path='../league-modals.mdl.ts' />

impakt.league.modals.controller('league.modals.saveDivision.ctrl',
['$scope',
'$uibModalInstance',
'_league',
'division',
function(
	$scope: any,
	$uibModalInstance: any,
	_league: any,
	division: League.Models.Division
) {

	$scope.division = division;

	$scope.ok = function() {

		_league.updateDivision($scope.division)
			.then(function(savedDivision) {
				$uibModalInstance.close(savedDivision);
			}, function(err) {
				$uibModalInstance.close(err);
			});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

}]);