/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('weekItem.ctrl', [
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

	$scope.week;
	$scope.season;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(week: Season.Models.Week) {
		if (!$state.is('season.drilldown.week')) {
			_details.selectedElements.deselectAll();
			_season.toWeekDrilldown(week);
		} else {
			_details.toggleSelection(week);
		}
	}
	
}]).directive('weekItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * week-item directive
	 */
	return {
		restrict: 'E',
		controller: 'weekItem.ctrl',
		scope: {
			week: '='
		},
		templateUrl: 'common/ui/week-item/week-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;
					
				}
			}
		}
	}
}]);