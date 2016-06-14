/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('playbookItem.ctrl', [
'$scope',
'$state',
'_details',
'_playbook',
function(
	$scope: any,
	$state: any,
	_details: any,
	_playbook: any
) {

	$scope.playbook;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function(playbook: Common.Models.PlaybookModel) {
		if (!$state.is('playbook.drilldown.playbook')) {
			_details.selectedElements.deselectAll();
			_playbook.toPlaybookDrilldown(playbook);
		} else {
			_details.toggleSelection(playbook);
		}
	}

	/**
	 *
	 * Item Drilldown
	 * 
	 */
	$scope.toPlaybookDrilldown = function(playbookModel: Common.Models.PlaybookModel) {
		_playbook.toPlaybookDrilldown(playbookModel);
	}
	
}]).directive('playbookItem', [
function(

) {
	/**
	 * playbook-item directive
	 */
	return {
		restrict: 'E',
		controller: 'playbookItem.ctrl',
		scope: {
			playbook: '='
		},
		templateUrl: 'common/ui/playbook-item/playbook-item.tpl.html',
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