/// <reference path='./search.mdl.ts' />

impakt.search.controller('search.ctrl',
['$scope', function($scope: any) {
	$scope.title = 'Results';
	$scope.query = '';
	$scope.results = [
		1, 2, 3, 4, 5
	];
}]);