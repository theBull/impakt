/// <reference path='../league-modals.mdl.ts' />
 
impakt.league.modals.controller('league.modals.createConference.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_associations',
'_league',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_league: any
) {

	$scope.leagues = impakt.context.League.leagues;
	$scope.newConference = new League.Models.Conference();
	$scope.selectedLeague = $scope.leagues.first();

	$scope.ok = function () {
		
		_league.createConference($scope.newConference)
		.then(function(createdConference: League.Models.Conference) {
			
			_associations.createAssociations(createdConference, [
				$scope.selectedLeague
			]);
			removeConferenceFromCreationContext();

			$uibModalInstance.close(createdConference);
		}, function(err) {
			removeConferenceFromCreationContext();
			console.error(err);
			$uibModalInstance.close(err);
		});
		
	};

	$scope.cancel = function() {
		removeConferenceFromCreationContext();
		$uibModalInstance.dismiss();
	};

	function removeConferenceFromCreationContext() {
		// Remove the play from the creation context
		// after creating the new play or cancelling
		if (Common.Utilities.isNotNullOrUndefined($scope.newConference))
			impakt.context.League.creation.conferences.remove($scope.newConference.guid);
	}
}]);