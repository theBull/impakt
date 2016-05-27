/// <reference path='../league-modals.mdl.ts' />

impakt.league.modals.controller('league.modals.createDivision.ctrl',[
'$scope',
'$uibModalInstance',
'_associations',
'_league',
'conference',
function(
	$scope: any,
	$uibModalInstance: any,
	_associations: any,
	_league: any,
	conference: any
) {

	$scope.conferences = impakt.context.League.conferences;
	$scope.newDivision = new League.Models.Division();
	$scope.selectedConference = conference ? conference : $scope.conferences.first();

	function init() {
		if (Common.Utilities.isNotNullOrUndefined($scope.selectedConference))
			$scope.newDivision.setConference($scope.selectedConference);
	}

	$scope.selectConference = function() {
		$scope.newDivision.setConference($scope.selectedConference);
	}

	$scope.ok = function() {

		if (Common.Utilities.isNullOrUndefined($scope.selectedConference))
			return;

		_league.createDivision($scope.newDivision)
			.then(function(createdDivision: League.Models.Division) {
				let associationsToAdd = [
					$scope.selectedConference
				];
				
				if(Common.Utilities.isNotNullOrUndefined($scope.selectedConference.league)) {
					associationsToAdd.push($scope.selectedConference.league);
				}

				_associations.createAssociations(createdDivision, associationsToAdd);
				removeDivisionFromCreationContext();

				$uibModalInstance.close(createdDivision);
			}, function(err) {
				removeDivisionFromCreationContext();
				console.error(err);
				$uibModalInstance.close(err);
			});

	};

	$scope.cancel = function() {
		removeDivisionFromCreationContext();
		$uibModalInstance.dismiss();
	};

	function removeDivisionFromCreationContext() {
		// Remove the play from the creation context
		// after creating the new play or cancelling
		if (Common.Utilities.isNotNullOrUndefined($scope.newDivision))
			impakt.context.League.creation.divisions.remove($scope.newDivision.guid);
	}

	init();
}]);