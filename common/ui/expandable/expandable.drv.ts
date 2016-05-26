/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('expandable.ctrl', [
'$scope',
'_expandable',
function(
	$scope: any,
	_expandable: any
) {

	$scope.expandable;

}]).directive('expandable', [
'$compile',  
function(
	$compile: any
) {
	
	return {
		restrict: 'E',
		controller: 'expandable.ctrl',
		transclude: true,
		replace: true,
		templateUrl: 'common/ui/expandable/expandable.tpl.html',
		scope: {
			collapsed: '=?',
			direction: '@',
			url: '@'
		},
		compile: function($element, attrs) {

			return {
				pre: function($scope, $element, attrs, controller, transcludeFn) {
					$scope.expandable = new Common.Models.Expandable($element);
					$scope.expandable.url = $scope.url;
					$scope.expandable.direction = $scope.direction;
					$scope.expandable.collapsed = Boolean($scope.collapsed) === false ? false : true;

					/**
					 * Set initial class on the element for proper sizing
					 */
					$scope.expandable.setInitialClass();
					$scope.expandable.ready = true;
				},
				post: function($scope, $element, attrs, controller, transcludeFn) {

				}
			}
		}
	}
}])
.directive('expandableToggle', [
function() {
	return {
		restrict: 'E',
		controller: 'expandable.ctrl',
		transclude: true,
		replace: true,
		require: '^expandable',
		template: "<div class='width3 pad {{expandable.handle.position}} \
			gray-bg-3-hover pointer font- white'\
			ng-click='expandable.toggle()'>\
				<div class='glyphicon {{expandable.handle.class}}'></div>\
			</div>'",
		compile: function($element, attrs) {

			return {
				pre: function($scope, $element, attrs, controller, transcludeFn) {

				},
				post: function($scope, $element, attrs, controller, transcludeFn) {
					/**
					 * Initialize the toggle handle
					 */
					$scope.expandable.initializeToggleHandle();
				}
			}
		}
	}
}
])