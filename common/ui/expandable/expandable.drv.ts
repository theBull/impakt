/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('expandable.ctrl', [
'$scope', 
function(
	$scope: any
) {

	$scope.direction;
	$scope.min = 3; // in em's
	$scope.max = 32; // in em's
	$scope.$element;
	$scope.em = parseInt($('body').css('font-size'));

	$scope.collapsed = true;
	$scope.ready = false;

	$scope.url;

	$scope.handle = {
		position: '',
		collapsed: '',
		expanded: '',
		class: ''
	}

	$scope.toggle = function() {
		
		$scope.collapsed = !$scope.collapsed;

		if($scope.collapsed) {
			$scope.$element.removeClass($scope.getMaxClass()).addClass($scope.getMinClass());
		} else {
			$scope.$element.removeClass($scope.getMinClass()).addClass($scope.getMaxClass());
		}

		$scope.setHandleClass();		
	}

	$scope.getMinClass = function() {
		return 'width' + $scope.min;
	}
	$scope.getMaxClass = function() {
		return 'width' + $scope.max;
	}
	$scope.getInitialClass = function() {
		return $scope.collapsed ? $scope.getMinClass() : $scope.getMaxClass();
	}
	$scope.setInitialClass = function() {
		$scope.$element.addClass($scope.getInitialClass());
	}

	$scope.initializeToggleHandle = function() {
		switch ($scope.direction) {
			case 'left':
				$scope.handle.position = 'top0 left0';
				$scope.handle.expanded = 'glyphicon-chevron-right';
				$scope.handle.collapsed = 'glyphicon-chevron-left';
				break;
			case 'right':
				$scope.handle.position = 'top0 right0';
				$scope.handle.expanded = 'glyphicon-chevron-left';
				$scope.handle.collapsed = 'glyphicon-chevron-right';
				break;
			case 'top':
				$scope.handle.position = 'top0 left0';
				$scope.handle.expanded = 'glyphicon-chevron-up';
				$scope.handle.collapsed = 'glyphicon-chevron-down';
				break;
			case 'bottom':
				$scope.handle.position = 'bottom0 left0';
				$scope.handle.expanded = 'glyphicon-chevron-down';
				$scope.handle.collapsed = 'glyphicon-chevron-up';
				break;
		}

		$scope.setHandleClass();
	}

	$scope.setHandleClass = function() {
		$scope.handle.class = $scope.collapsed ?
			$scope.handle.collapsed : $scope.handle.expanded;
	}

	/**
	 * Deprecated
	 * @param {[type]} value [description]
	 */
	$scope.getWidth = function(value) {
		return $scope.em * parseInt(value);
	}
	/**
	 * Deprecated
	 */
	$scope.getInitialWidth = function() {
		return $scope.collapsed ? 
			$scope.getWidth($scope.min) : 
			$scope.getWidth($scope.max);
	}

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
					$scope.$element = $element;

					/**
					 * Set initial class on the element for proper sizing
					 */
					$scope.setInitialClass();

					$scope.ready = true;
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
		template: "<div class='width3 pad {{handle.position}} \
			gray-bg-3-hover pointer font- white'\
			ng-click='toggle()'>\
				<div class='glyphicon {{handle.class}}'></div>\
			</div>'",
		compile: function($element, attrs) {

			return {
				pre: function($scope, $element, attrs, controller, transcludeFn) {

				},
				post: function($scope, $element, attrs, controller, transcludeFn) {
					/**
					 * Initialize the toggle handle
					 */
					$scope.initializeToggleHandle();
				}
			}
		}
	}
}
])