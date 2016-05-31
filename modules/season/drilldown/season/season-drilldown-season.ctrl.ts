/// <reference path='./season-drilldown-season.mdl.ts' />

impakt.season.drilldown.season.controller('season.drilldown.season.ctrl', [
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
	$scope.games = new Season.Models.GameCollection();

	let deleteGameListener = $rootScope.$on('delete-game', function(e: any, game: Season.Models.Game) {
		$scope.games.remove(game.guid);
	});

	let associationsUpdatedListener = $rootScope.$on('associations-updated', function(e: any) {
		init();
	});

	$scope.$on('$destroy', function() {
		deleteGameListener();
		associationsUpdatedListener();
	});

	function init() {
		let seasonAssociations = _associations.getAssociated($scope.season);

		if (Common.Utilities.isNotNullOrUndefined(seasonAssociations)) {
			$scope.games = seasonAssociations.games;
			$scope.games.forEach(function(game: Season.Models.Game, index: number) {
				let gameAssociations = _associations.getAssociated(game);
				//game.setSeason($scope.season);
			});
		}
		$scope.season.weeks.forEach(function(week: Season.Models.Week, index: number) {
			
		});
	}

	$scope.createGame = function() {
		_seasonModals.createGame($scope.season)
		.then(function() {
			init();	
		});
	}

	init();

}]);