/// <reference path='../ui.mdl.ts' />

impakt.common.ui.directive('details', [
function() {
	
	return {
		restrict: 'E',
		compile: function($element, attrs) {

			return {
				pre: function($scope, $element, attrs, controller, transcludeFn) {
					
				},
				post: function($scope, $element, attrs, controller, transcludeFn) {

				}
			}
		}
	}
}]);