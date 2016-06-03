/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('planItem.ctrl', [
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

	$scope.plan;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(plan: Planning.Models.Plan) {
		if(!$state.is('planning.drilldown.plan')) {
			_details.selectedElements.deselectAll();
			_planning.toPlanDrilldown(plan);	
		} else {
			_details.toggleSelection(plan);
		}
	}
	
}]).directive('planItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * plan-item directive
	 */
	return {
		restrict: 'E',
		controller: 'planItem.ctrl',
		scope: {
			plan: '='
		},
		templateUrl: 'common/ui/plan-item/plan-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.plan);

					if(Common.Utilities.isNotNullOrUndefined(associations)) {
						// handle associations
					}

					if(Common.Utilities.isNotNullOrUndefined($scope.plan) &&
						Common.Utilities.isNotEmptyString($scope.plan.gameGuid)) {
						let game = impakt.context.Season.games.get($scope.plan.gameGuid);
						$scope.plan.setGame(game);
					}
					
				}
			}
		}
	}
}]);