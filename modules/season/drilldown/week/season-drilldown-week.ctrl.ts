/// <reference path='./season-drilldown-week.mdl.ts' />

impakt.season.drilldown.week.controller('season.drilldown.week.ctrl', [
'$scope', 
'$rootScope',
'_associations',
'_season', 
'_seasonModals',
function(
	$scope: any,
	$rootScope: any,
	_associations: any, 
	_season: any, 
	_seasonModals: any
) {

	$scope.season = _season.drilldown.season;
	$scope.week = _season.drilldown.week;
	$scope.allGames = impakt.context.Season.games;
	$scope.games = new Season.Models.GameCollection();
	$scope.teams = impakt.context.Team.teams;
	$scope.location = impakt.context.League.locations;

	let deleteGameListener = $rootScope.$on('delete-game', function(e: any, game: Season.Models.Game) {
		$scope.games.remove(game.guid);
	});

	let associationsUpdatedListener = $rootScope.$on('associations-updated', function(e: any) {
		init();
	});

	$scope.$on('$destroy', function() {
		associationsUpdatedListener();
		deleteGameListener();
	});

	function init() {
		if (Common.Utilities.isNullOrUndefined($scope.week) ||
			Common.Utilities.isNullOrUndefined($scope.games))
			return;

		$scope.allGames.forEach(function(game: Season.Models.Game, index: number) {
			if (game.weekGuid == $scope.week.guid) {
				let gameAssociations = _associations.getAssociated(game);
				if(Common.Utilities.isNotNullOrUndefined(gameAssociations.locations)) {
					game.setLocation(gameAssociations.locations.first())
				}
				if(Common.Utilities.isNotNullOrUndefined(gameAssociations.teams)) {
					game.setAway(gameAssociations.teams.get(game.awayGuid));
					game.setHome(gameAssociations.teams.get(game.homeGuid));
				}
				game.setWeek($scope.week);
				$scope.games.add(game);
			}
		});
	}

	$scope.createGame = function() {
		_seasonModals.createGame($scope.season, $scope.week)
		.then(function() {
			init();
		});
	}

	init();

}]);