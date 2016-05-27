/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('divisionItem.ctrl', [
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

	$scope.division;
	$scope.element;

	$scope.getConference = function(division: League.Models.Division) {
		return Common.Utilities.isNotNullOrUndefined(division) ?
			(Common.Utilities.isNotNullOrUndefined(division.conference) ?
				division.conference.name : 'No league') :
			'No league';
	}

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(division: League.Models.Division) {
		if (!$state.is('league.drilldown.division')) {
			_details.selectedElements.deselectAll();
			_league.toDivisionDrilldown(division);
		} else {
			_details.toggleSelection(division);
		}
	}
	
}]).directive('divisionItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * division-item directive
	 */
	return {
		restrict: 'E',
		controller: 'divisionItem.ctrl',
		scope: {
			division: '='
		},
		templateUrl: 'common/ui/division-item/division-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.division);

					if(Common.Utilities.isNotNullOrUndefined(associations) &&
						associations.conferences.hasElements()) {
						$scope.division.setConference(associations.conferences.first());
					}
					
				}
			}
		}
	}
}]);