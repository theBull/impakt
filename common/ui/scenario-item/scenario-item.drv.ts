/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('scenarioItem.ctrl', [
'$scope',
'_details',
'_playbook',
function(
	$scope: any,
	_details: any,
	_playbook: any
) {

	$scope.scenario;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(scenario: Common.Models.Scenario) {
		_details.toggleSelection(scenario);
	}

	$scope.openInEditor = function(scenario: Common.Models.Scenario) {
		_playbook.editScenario(scenario);
	}
	
}]).directive('scenarioItem', [
function(

) {
	/**
	 * scenario-item directive
	 */
	return {
		restrict: 'E',
		controller: 'scenarioItem.ctrl',
		scope: {
			scenario: '='
		},
		templateUrl: 'common/ui/scenario-item/scenario-item.tpl.html',
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