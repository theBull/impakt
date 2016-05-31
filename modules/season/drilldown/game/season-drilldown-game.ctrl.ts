/// <reference path='./season-drilldown-game.mdl.ts' />

impakt.season.drilldown.game.controller('season.drilldown.game.ctrl', [
'$scope', 
'$rootScope',
'_associations',
'_season', 
'_seasonModals', 
'_teamModals',
function(
	$scope: any,
	$rootScope: any,
	_associations: any, 
	_season: any, 
	_seasonModals: any,
	_teamModals: any
) {

	$scope.season = _season.drilldown.season;
	$scope.game = _season.drilldown.game;
	$scope.teams = new Team.Models.TeamModelCollection()
	$scope.homeTeam = null;
	$scope.awayTeam = null;

	let deleteGameListener = $rootScope.$on('delete-game', function(e: any, game: Season.Models.Game) {
		if (!Common.Utilities.isNullOrUndefined(_season.drilldown.week))
			_season.toWeekDrilldown(_season.drilldown.week);
	});

	let associationsUpdatedListener = $rootScope.$on('associations-updated', function(e: any) {
		init();
	});

	$scope.$on('$destroy', function() {
		deleteGameListener();
		associationsUpdatedListener();
	});

	function init() {
		let gameAssociations = _associations.getAssociated($scope.game);
		$scope.game.setSeason($scope.season);

		if (Common.Utilities.isNotNullOrUndefined(gameAssociations)) {
			$scope.teams = gameAssociations.teams;
			$scope.teams.forEach(function(team: Team.Models.TeamModel, index: number) {
				let teamAssociations = _associations.getAssociated(team);
				//team.setGame($scope.game);						
			});
		}
	}

	init();

}]);