/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('seasonItem.ctrl', [
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

	$scope.season;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(season: Season.Models.SeasonModel) {
		if(!$state.is('season.drilldown.season')) {
			_details.selectedElements.deselectAll();
			_season.toSeasonDrilldown(season);	
		} else {
			_details.toggleSelection(season);
		}
	}
	
}]).directive('seasonItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * season-item directive
	 */
	return {
		restrict: 'E',
		controller: 'seasonItem.ctrl',
		scope: {
			season: '='
		},
		templateUrl: 'common/ui/season-item/season-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.season);

					if(Common.Utilities.isNotNullOrUndefined(associations)) {
						// handle associations
					}
					
				}
			}
		}
	}
}]);