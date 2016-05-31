/// <reference path='../season-modals.mdl.ts' />
 
impakt.season.modals.controller('season.modals.createGame.ctrl', 
[
'$scope', 
'$uibModalInstance', 
'_associations',
'_season',
'_leagueModals',
'season',
'week',
function(
	$scope: any, 
	$uibModalInstance: any, 
	_associations: any,
	_season: any,
	_leagueModals: any,
	season: any,
	week: any
) {

	$scope.seasons = impakt.context.Season.seasons;
	$scope.newGame = new Season.Models.Game();
	$scope.selectedSeason = season || $scope.seasons.first();
	$scope.teams = impakt.context.Team.teams;
	$scope.locations = impakt.context.League.locations; 

	// TODO @theBull
	$scope.selectedHomeTeam = new Team.Models.TeamModel();
	$scope.selectedAwayTeam = new Team.Models.TeamModel();
	$scope.selectedWeek = week || new Season.Models.Week();

	// initalize selected location with:
	// - home team's location, if it exists - or - first location in the list
	$scope.selectedLocation = $scope.selectedHomeTeam && $scope.selectedHomeTeam.location ? 
		$scope.selectedHomeTeam.location : $scope.locations.first();

	function init() {
		if(Common.Utilities.isNotNullOrUndefined(week)) {
			$scope.newGame.weekGuid = week.guid;
		}
	}

	$scope.teamChange = function() {
		$scope.newGame.setHome($scope.selectedHomeTeam);
		$scope.newGame.setAway($scope.selectedAwayTeam);
	}

	$scope.selectLocation = function() {
		if (Common.Utilities.isNotNullOrUndefined($scope.selectedLocation)) {
			$scope.newGame.setLocation($scope.selectedLocation);
		}
	}

	$scope.selectWeek = function() {
		$scope.newGame.weekGuid = $scope.selectedWeek.guid;
	}

	$scope.createLocation = function() {
		_leagueModals.createLocation().then(function(createdLocation: League.Models.Location) {
			$scope.locations = impakt.context.League.locations;
			$scope.selectedLocation = createdLocation;
			$scope.selectLocation();
		})
	}

	$scope.updateDatetime = function() {
		// TODO @theBull
	}

	$scope.ok = function () {
		
		_season.createGame($scope.newGame)
		.then(function(createdGame: Season.Models.Game) {

			let associationsToAdd = [
				$scope.selectedHomeTeam,
				$scope.selectedAwayTeam,
				$scope.selectedSeason,
				$scope.selectedLocation
			];

			_associations.createAssociations(createdGame, associationsToAdd);

			$uibModalInstance.close(createdGame);
		}, function(err) {
			$uibModalInstance.close(err);
		});
		
		$uibModalInstance.close();

	};

	$scope.cancel = function() {
		removeGameFromCreationContext();
		$uibModalInstance.dismiss();
	};

	function removeGameFromCreationContext() {
		// Remove the play from the creation context
		// after creating the new play or cancelling
		if (Common.Utilities.isNotNullOrUndefined($scope.newGame))
			impakt.context.Season.creation.games.remove($scope.newGame.guid);
	}

	init();
}]);