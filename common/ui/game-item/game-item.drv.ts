/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('gameItem.ctrl', [
'$scope',
'$state',
'_details',
'_season',
'_associations',
function(
	$scope: any,
	$state: any,
	_details: any,
	_season: any,
	_associations: any
) {

	$scope.game;
	$scope.element;

	$scope.getSeason = function(game: Season.Models.Game) {
		return Common.Utilities.isNotNullOrUndefined(game) ?
			(Common.Utilities.isNotNullOrUndefined(game.season) ?
				game.season.name : 'No season') :
			'No season';
	}

	$scope.getWeek = function(game: Season.Models.Game) {
		return Common.Utilities.isNotNullOrUndefined(game) ?
			(Common.Utilities.isNotNullOrUndefined(game.week) ?
				game.week.name : 'No week') :
			'No week';
	}

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(game: Season.Models.Game) {
		if (!$state.is('season.drilldown.game')) {
			_details.selectedElements.deselectAll();
			_season.toGameDrilldown(game);
		} else {
			_details.toggleSelection(game);
		}
	}
	
}]).directive('gameItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * game-item directive
	 */
	return {
		restrict: 'E',
		controller: 'gameItem.ctrl',
		scope: {
			game: '='
		},
		templateUrl: 'common/ui/game-item/game-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.game);

					if(Common.Utilities.isNotNullOrUndefined(associations) &&
						associations.seasons.hasElements()) {
						$scope.game.setSeason(associations.seasons.first());
					}
					
				}
			}
		}
	}
}]);