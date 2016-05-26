/// <reference path='../ui.mdl.ts' />

impakt.common.ui.directive('camelCaseToSpace', [function() {

	return {
		restrict: 'A',
		scope: {
			string: '@',
			capitalize: '@'
		},
		link: function($scope: any, $element: any, attrs: any) {
			if (!$scope.string)
				return;

			$scope.capitalize = Boolean($scope.capitalize);
			$scope.string = Common.Utilities.camelCaseToSpace($scope.string, $scope.capitalize);

			$element.html($scope.string);
		}
	}

}]);