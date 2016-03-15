/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('expandable.ctrl', [
'$scope', function($scope: any) {
	console.log('expandable.ctrl - loaded');
	let directions = ['left', 'right', 'up', 'down'];
	$scope.direction = '';
	$scope.min = 3; // in em's
	$scope.max = 34; // in em's
	$scope.$element = null;
	$scope.em = parseInt($('body').css('font-size'));

	$scope.collapsed = false;
	$scope.toggle = function() {
		
		$scope.collapsed = !$scope.collapsed;
		let toWidth = 0;
		if($scope.collapsed) {
			toWidth = $scope.getWidth($scope.min);
			$scope.$element.width(toWidth);
			console.log('collapse panel', toWidth);
		} else {
			toWidth = $scope.getWidth($scope.max);
			$scope.$element.width(toWidth);
			console.log('expand panel', toWidth);
		}
		
	}

	$scope.getWidth = function(value) {
		return $scope.em * parseInt(value);
	}
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
		scope: {
			direction: '@direction',
			min: '@min',
			max: '@max'
		},
		compile: function($element, attrs) {

			return {
				pre: function($scope, $element, attrs, controller, transcludeFn) {

				},
				post: function($scope, $element, attrs, controller, transcludeFn) {
					$scope.$element = $element;
				 	var init = function() {
						
						$element.width($scope.getInitialWidth());

						let $handle = $('<div />', {
							'class': 'expandable-handle expandable-handle-vertical'
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
								let toWidth = elementWidth + deltaX;
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

						$element.append($handle);
						
				 	}
					
					$timeout(init, 0);

					let toggleIcon = $compile([
						"<div class='pad top0 right0 dark-bg-hover pointer font-white zIndexTop' ",
						'ng-click="toggle()">',
						'<div class="glyphicon"',
						'ng-class="{',
						"'glyphicon-chevron-left': !collapsed,",
						"'glyphicon-chevron-right': collapsed",
						'}">',
						'</div>',
						'</div>'
					].join(''))($scope);

					$element.prepend(toggleIcon);
				}
			}
		}
	}
}]);