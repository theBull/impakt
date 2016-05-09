/// <reference path='../ui.mdl.ts' />

impakt.common.ui.directive('search', [
function() {
	
	return {
		restrict: 'E',
		templateUrl: 'common/ui/search/search.tpl.html',
		transclude: true,
		replace: true,
		link: function($scope, $element, attrs) {
				
		}
	}
}]);