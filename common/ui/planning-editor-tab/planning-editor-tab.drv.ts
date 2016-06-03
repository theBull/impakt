/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('planningEditorTab.ctrl', [
'$scope',
'$state',
'_planningEditor',
function(
	$scope: any,
	$state: any,
	_planningEditor: any
) {

	$scope.tab;
	$scope.element;

	/**
	 *
	 *	Item selection
	 * 
	 */
	$scope.toggleSelection = function() {
		if(!$scope.tab.selected) {
			_planningEditor.activateTab($scope.tab);
		}
	}

	/**
	 * Close
	 */
	$scope.close = function() {
		_planningEditor.close($scope.tab);
	}
	
}]).directive('planningEditorTab', [
'_associations',
function(
	_associations: any
) {
	/**
	 * planning-editor-tab directive
	 */
	return {
		restrict: 'E',
		controller: 'planningEditorTab.ctrl',
		scope: {
			tab: '=tabObject'
		},
		templateUrl: 'common/ui/planning-editor-tab/planning-editor-tab.tpl.html',
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