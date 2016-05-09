/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('grid.ctrl', [
'$scope',
'_details',
function(
	$scope: any,
	_details: any
) {

	$scope.play;
	$scope.element;
	
}]).directive('grid', [
function(

) {
	/**
	 * play-item directive
	 */
	return {
		restrict: 'E',
		controller: 'grid.ctrl',
		scope: {
			element: '='
		},
		templateUrl: '',
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