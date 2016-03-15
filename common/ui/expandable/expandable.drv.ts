/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('expandable.ctrl', [
'$scope', function($scope: any) {
	console.log('expandable.ctrl - loaded');
	let directions = ['left', 'right', 'up', 'down'];
	$scope.direction = 'left';
	$scope.min = 3; // in em's
	$scope.max = 32; // in em's
	$scope.$element = null;
	$scope.em = parseInt($('body').css('font-size'));

	$scope.collapsed = true;
	$scope.ready = false;

	$scope.toggle = function() {
		
		$scope.collapsed = !$scope.collapsed;

		if($scope.collapsed) {
			$scope.$element.removeClass($scope.getMaxClass()).addClass($scope.getMinClass());
			console.log('collapse panel');
		} else {
			$scope.$element.removeClass($scope.getMinClass()).addClass($scope.getMaxClass());
			console.log('expand panel');
		}
		
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
'$timeout', '$compile', 
function($timeout: any, $compile: any) {
	return {
		restrict: 'E',
		controller: 'expandable.ctrl',
		compile: function($element, attrs) {

			return {
				pre: function($scope, $element, attrs, controller, transcludeFn) {

				},
				post: function($scope, $element, attrs, controller, transcludeFn) {
					$element.hide();

					$scope.$element = $element;
					$scope.direction = attrs.direction || $scope.direction;
					$scope.collapsed = attrs.collapsed == 'true' || 
						attrs.collapsed == 'false' ? 
							attrs.collapsed == 'true' : $scope.collapsed;

					let multiplier = $scope.direction == 'left' ||
						$scope.direction == 'bottom' ?
						-1 : 1;
					let position = '';
					let collapseHandle = '';
					let expandHandle = '';
					switch ($scope.direction) {
						case 'left':
							position = 'top0 left0';
							collapseHandle = 'glyphicon-chevron-right';
							expandHandle = 'glyphicon-chevron-left';
							break;
						case 'right':
							position = 'top0 right0';
							collapseHandle = 'glyphicon-chevron-left';
							expandHandle = 'glyphicon-chevron-right';
							break;
						case 'top':
							position = 'top0 left0';
							collapseHandle = 'glyphicon-chevron-up';
							expandHandle = 'glyphicon-chevron-down';
							break;
						case 'bottom':
							position = 'bottom0 left0';
							collapseHandle = 'glyphicon-chevron-down';
							expandHandle = 'glyphicon-chevron-up';
							break;
					}

				 	var init = function() {
						
						/**
						 * Set initial class on the element for proper sizing
						 */
						$scope.setInitialClass();

						let $handle = $('<div />', {
							'ng-show': '!collapsed',
							'class': [
								'expandable-handle ',
								'expandable-handle-vertical ',
								'expandable-', $scope.direction, ' ',
								position
							].join('')
						});
						let dragging = false;
						let startX = 0;
						let elementWidth = $element.width();
						$handle.mousedown(function(e1) {
							startX = e1.pageX;
							dragging = true;
							let elementWidth = $element.width();
							$('body').on('mousemove', function(e) {
								let deltaX = e.pageX - startX;
								let toWidth = elementWidth + (multiplier * deltaX);
								if (dragging && toWidth > $scope.min) {
									$element.width(toWidth);
								}
							}).on('mouseup', function(e) {
								if (dragging) {
									dragging = false;
								}
							});
						}).mouseup(function(e) {
							startX = 0;
							dragging = false;
							elementWidth = $element.width();
							$('body').off('mousemove').off('mouseup');
						});

						$element.append($compile($handle[0])($scope));
						
				 	}
					
					$timeout(init, 0);

					let toggleIcon = $compile([
						"<div class='pad ",
						position,
						" dark-bg-hover pointer font-white zIndexTop' ",
						'ng-click="toggle()">',
						'<div class="glyphicon"',
						'ng-class="{',
						"'", collapseHandle, "': !collapsed,",
						"'", expandHandle, "': collapsed",
						'}">',
						'</div>',
						'</div>'
					].join(''))($scope);

					$element.prepend(toggleIcon);

					$scope.ready = true;
					$element.show();
				}
			}
		}
	}
}]);