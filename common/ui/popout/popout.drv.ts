/// <reference path='../ui.mdl.ts' />

impakt.common.ui.directive('popout', [
	'$compile',
	function($compile: any) {

	// button to open with label
	// open / close icon
	// open direction (up / down / left / right)

	return {
		restrict: 'E',
		controller: function($scope: any) {

			console.debug('controller: popout.ctrl');

			$scope.collapsed = true;
			$scope.data = {};
			$scope.label = 'label';
			$scope.open = 'down';

			$scope.classes = {
				expand: '',
				collapse: ''
			}
			$scope.toggleIconClass = 'glyphicon-chevron-down';

			function init() {
				$scope.toggleIconClass = $scope.setToggleIconClass();
				$scope.collapsed = true;
			}

			$scope.getCollapsed = function() {
				return $scope.collapsed;
			}
			$scope.getData = function() {
				return $scope.data;
			}
			$scope.getLabel = function() {
				return $scope.label;
			}
			$scope.getToggleIconClass = function() {
				return $scope.toggleIconClass;
			}

			$scope.toggle = function(close?: boolean) {

				$scope.collapsed = close === true ? true : !$scope.collapsed;
				$scope.toggleIconClass = $scope.setToggleIconClass();

				removeClickeater();

				if (!$scope.collapsed) {
					// add clikeater element when toggling
					let $clickeater = angular.element(
						$('<popout-clickeater></popout-clickeater>')
					);
					$compile($clickeater)($scope);
					$('body').append($clickeater);
				}

				console.log($scope.collapsed ? 'close' : 'open', 'popout');

			}

			$scope.setToggleIconClass = function() {

				switch ($scope.open) {
					case 'down':
						$scope.classes.expand = 'glyphicon-chevron-down';
						$scope.classes.collapse = 'glyphicon-chevron-up';
						break;
					case 'up':
						$scope.classes.expand = 'glyphicon-chevron-up';
						$scope.classes.collapse = 'glyphicon-chevron-down';
						break;
					case 'left':
						$scope.classes.expand = 'glyphicon-chevron-left';
						$scope.classes.collapse = 'glyphicon-chevron-right';
						break;
					case 'right':
						$scope.classes.expand = 'glyphicon-chevron-right';
						$scope.classes.collapse = 'glyphicon-chevron-left';
						break;
				}

				return $scope.collapsed ? $scope.classes.expand : $scope.classes.collapse;
			}

			$scope.close = function() {
				$scope.toggle(true);
			}

			function removeClickeater() {
				// remove in case it already exists
				console.log('remove popout clickeater');
				$('.popout-clickeater').remove();
			}

			init();

		},
		// scope: {
		// 	data: '=',
		// 	open: '=',
		// 	collapsed: '=?',
		// 	label: '=',
		// },
		scope: true,
		link: function($scope, $element, attrs) {

		}
	}

}]).directive('popoutToggle', [
function() {
	return {
		restrict: 'E',
		require: '^popout',
		replace: true,
		transclude: true,
		scope: true,
		template: '<div class="popout-toggle" ng-click="toggle()">\
			<span class="marginRight1">{{label}}</span>\
			<span class="glyphicon {{toggleIconClass}}"></span>\
		</div>',
		link: function($scope, $element, attrs) {
			console.log($scope);
		}
	}
}])
.directive('popoutContents', [function() {
	return {
		restrict: 'E',
		require: '^popout',
		scope: true,
		replace: true,
		transclude: true,
		template: '<div class="popout-contents" ng-show="!collapsed"></div>',
		link: function($scope, $element, attrs) {

		}
	}
}])
.directive('popoutClickeater', [function() {
	return {
		restrict: 'E',
		scope: true,
		replace: true,
		transclude: true,
		template: '<div class="popout-clickeater" ng-click="close()"></div>',
		link: function($scope, $element, attrs) {

		}
	}
}]);