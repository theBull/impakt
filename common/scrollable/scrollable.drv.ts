///<reference path='./scrollable.mdl.ts' />

impakt.common.scrollable.directive('scrollable', 
	['_scrollable', function(_scrollable: any) {
	console.debug('directive: impakt.common.scrollable - register');
	
	return {
		restrict: 'A',
		link: function($scope: any, $element: any, attrs: any) {
			console.log('scrollable element');

		}
	}

}]);

