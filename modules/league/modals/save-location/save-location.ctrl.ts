/// <reference path='../league-modals.mdl.ts' />

impakt.league.modals.controller('league.modals.saveLocation.ctrl',[
'$scope',
'$uibModalInstance',
'_league',
'location',
function(
	$scope: any,
	$uibModalInstance: any,
	_league: any,
	location: League.Models.Location
) {

	$scope.location = location;

	$scope.ok = function() {

		_league.updateLocation($scope.location)
			.then(function(savedLocation) {
				$uibModalInstance.close(savedLocation);
			}, function(err) {
				$uibModalInstance.close(err);
			});
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss();
	};

}]);