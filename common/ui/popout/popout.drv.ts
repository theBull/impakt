/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('popout.ctrl', [
'$scope',
function(
	$scope: any
) {

	$scope.expandable;
	$scope.collection;

}]).directive('popout', [
function() {

return {
	restrict: 'E',
	controller: 'popout.ctrl',
	scope: {
		data: '=',
		direction: '@',
		collapsed: '@?',
		label: '=',
		url: '@',
		itemSelect: '&'
	},
	transclude: true,
	replace: true,
	templateUrl: 'common/ui/popout/popout.tpl.html',
	link: function($scope, $element, attrs) {
		$scope.expandable = new Common.Models.Expandable($element);
		$scope.expandable.url = $scope.url;
		$scope.expandable.label = $scope.label;
		$scope.expandable.direction = $scope.direction;
		$scope.expandable.collapsed = Boolean($scope.collapsed) === false ? false : true;
		$scope.expandable.expandable = false;

		/**
		 * Set initial class on the element for proper sizing
		 */
		$scope.expandable.ready = true;
	}
}

}]).directive('popoutToggle', [
function() {
	return {
		restrict: 'E',
		controller: 'popout.ctrl',
		require: '^popout',
		replace: true,
		transclude: true,
		templateUrl: 'common/ui/popout/popout-toggle.tpl.html',
		link: function($scope, $element, attrs) {
			/**
			 * Initialize the toggle handle
			 */
			$scope.expandable.initializeToggleHandle();
		}
	}
}]).directive('popoutContents', [function() {
	return {
		restrict: 'E',
		controller: 'popout.ctrl',
		require: '^popout',
		scope: {
			collection: '='
		},
		link: function($scope, $element, attrs) {}
	}
}])
.directive('popoutClickeater', [function() {
	return {
		restrict: 'E',
		scope: true,
		replace: true,
		transclude: true,
		templateUrl: 'common/ui/popout/popout-clickeater.tpl.html',
		link: function($scope, $element, attrs) {

		}
	}
}]);