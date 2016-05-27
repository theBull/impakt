/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('leagueItem.ctrl', [
'$scope',
'$state',
'_details',
'_league',
'_associations',
function(
	$scope: any,
	$state: any,
	_details: any,
	_league: any,
	_associations: any
) {

	$scope.league;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(league: League.Models.LeagueModel) {
		if(!$state.is('league.drilldown.league')) {
			_details.selectedElements.deselectAll();
			_league.toLeagueDrilldown(league);	
		} else {
			_details.toggleSelection(league);
		}
	}
	
}]).directive('leagueItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * league-item directive
	 */
	return {
		restrict: 'E',
		controller: 'leagueItem.ctrl',
		scope: {
			league: '='
		},
		templateUrl: 'common/ui/league-item/league-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.league);

					if(Common.Utilities.isNotNullOrUndefined(associations)) {
						// handle associations
					}
					
				}
			}
		}
	}
}]);