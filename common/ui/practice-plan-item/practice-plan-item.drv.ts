/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('practicePlanItem.ctrl', [
'$scope',
'$state',
'_details',
'_planning',
'_associations',
function(
	$scope: any,
	$state: any,
	_details: any,
	_planning: any,
	_associations: any
) {

	$scope.practicePlan;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(practicePlan: Planning.Models.PracticePlan) {
		_details.toggleSelection(practicePlan);
	}

	/**
	 * Hover
	 */
	$scope.hoverIn = function() {
		if (Common.Utilities.isNullOrUndefined($scope.practicePlan))
			return;
		$scope.practicePlan.hoverIn();
	}
	$scope.hoverOut = function() {
		if (Common.Utilities.isNullOrUndefined($scope.practicePlan))
			return;
		$scope.practicePlan.hoverOut();
	}

	/**
	 *
	 *	Edit item
	 * 
	 */
	$scope.edit = function() {
		_planning.toPracticePlanEditor($scope.practicePlan);
	}
	
}]).directive('practicePlanItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * practice-plan-item directive
	 */
	return {
		restrict: 'E',
		controller: 'practicePlanItem.ctrl',
		scope: {
			practicePlan: '='
		},
		templateUrl: 'common/ui/practice-plan-item/practice-plan-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.practicePlan);

					if(Common.Utilities.isNotNullOrUndefined(associations)) {
						// handle associations
					}
					
				}
			}
		}
	}
}]);