/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('scoutCardItem.ctrl', [
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

	$scope.scoutCard;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(scoutCard: Planning.Models.ScoutCard) {
		_details.toggleSelection(scoutCard);
	}

	/**
	 * Hover
	 */
	$scope.hoverIn = function() {
		if (Common.Utilities.isNullOrUndefined($scope.scoutCard))
			return;
		$scope.scoutCard.hoverIn();
	}
	$scope.hoverOut = function() {
		if (Common.Utilities.isNullOrUndefined($scope.scoutCard))
			return;
		$scope.scoutCard.hoverOut();
	}

	/**
	 *
	 *	Edit item
	 * 
	 */
	$scope.edit = function() {
		_planning.toScoutCardEditor($scope.scoutCard);
	}
	
}]).directive('scoutCardItem', [
'_associations',
function(
	_associations: any
) {
	/**
	 * scout-card-item directive
	 */
	return {
		restrict: 'E',
		controller: 'scoutCardItem.ctrl',
		scope: {
			scoutCard: '='
		},
		templateUrl: 'common/ui/scout-card-item/scout-card-item.tpl.html',
		transclude: true,
		replace: true,
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					
					$scope.$element = $element;

					let associations = _associations.getAssociated($scope.scoutCard);

					if(Common.Utilities.isNotNullOrUndefined(associations)) {
						// handle associations
					}
					
				}
			}
		}
	}
}]);