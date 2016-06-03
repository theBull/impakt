/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('gamePlanItem.ctrl', [
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

	$scope.gamePlan;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(gamePlan: Planning.Models.GamePlan) {
		_details.toggleSelection(gamePlan);
	}

	/**
	 * Hover
	 */
	$scope.hoverIn = function() {
		if (Common.Utilities.isNullOrUndefined($scope.gamePlan))
			return;
		$scope.gamePlan.hoverIn();
	}
	$scope.hoverOut = function() {
		if (Common.Utilities.isNullOrUndefined($scope.gamePlan))
			return;
		$scope.gamePlan.hoverOut();
	}

	/**
	 *
	 *	Edit item
	 * 
	 */
	$scope.edit = function() {
		_planning.toGamePlanEditor($scope.gamePlan);
	}
	
}]).directive('gamePlanItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * game-plan-item directive
	 */
	return {
		restrict: 'E',
		controller: 'gamePlanItem.ctrl',
		scope: {
			gamePlan: '='
		},
		templateUrl: 'common/ui/game-plan-item/game-plan-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.gamePlan);

					if(Common.Utilities.isNotNullOrUndefined(associations)) {
						// handle associations
					}
					
				}
			}
		}
	}
}]);