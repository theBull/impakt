/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.createLocation.ctrl', [
'$scope', 
'$rootScope',
'$uibModalInstance', 
'_associations',
'_league',
'associatedEntity',
function(
	$scope: any, 
	$rootScope: any,
	$uibModalInstance: any, 
	_associations: any,
	_league: any,
	associatedEntity: any
) {

	$scope.newLocation = new League.Models.Location();
	$scope.associatedEntity = associatedEntity;

	$scope.ok = function () {
		
		_league.createLocation($scope.newLocation)
		.then(function(createdLocation: League.Models.Location) {

			// take in an optional associated entity, so that upon creation
			// of this location, we're able to also construct the association
			// between the two entities.
			if(Common.Utilities.isNotNullOrUndefined($scope.associatedEntity)) {
				_associations.createAssociation(createdLocation, $scope.associatedEntity);
			}

			$uibModalInstance.close(createdLocation);
		}, function(err) {
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss();
	};

}]);