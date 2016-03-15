/// <reference path='../ui.mdl.ts' />

impakt.common.ui
.controller('impakt.common.ui.slidingPanel.ctrl', [
	'$scope',
	function($scope: any) {
		$scope.layers = [];
		
		$scope.index = 0;
		$scope.isVisibleLayer = function(i) {
			return i == $scope.index;
		}
		$scope.next = function() {
			let oldIndex = $scope.index;
			if ($scope.hasLayers()) {
				$scope.index = $scope.hasNextLayer() ? $scope.index + 1 : 0;
			}
			console.log('next layer:', oldIndex, '->', $scope.index, $scope.layers);
		}
		$scope.prev = function() {
			if ($scope.hasLayers()) {
				$scope.index = $scope.hasPrevLayer() ? $scope.index - 1 : $scope.layers.length - 1;
			}
		}
		$scope.to = function(index: number) {
			if($scope.hasLayers() && index >= 0 && index < $scope.layers.length - 1) {
				$scope.index = index;
			}
		}
		$scope.hasLayers = function() {
			return $scope.layers && $scope.layers.length > 0;
		}
		$scope.hasNextLayer = function() {
			return $scope.index < $scope.layers.length - 1;
		}
		$scope.hasPrevLayer = function() {
			return $scope.index > 0;
		}
	}
])
.directive('slidingPanel',
['$compile',
function(
	$compile: any
) {
	
	console.debug('directive: impakt.common.ui.slidingPanel - register');

	return {
		restrict: 'E',
		controller: 'impakt.common.ui.slidingPanel.ctrl',
		link: function($scope: any, $element: any, attrs: any) {

			let layers = [];
			// get all child slidingPanelLayers
			let layer = $element.find('sliding-panel-layer');
			console.log('sliding panel layer', layer);

			console.log('sliding panel layers', layers);

			// panel template
			// content template
			
		}
	}

}])
.directive('slidingPanelLayer', ['$compile', function($compile: any) {
	return {
		restrict: 'E',
		link: function($scope: any, $element: any, attrs: any) {
			console.log('slidingPanelLayer', attrs, $scope);

			let guid = Common.Utilities.guid();
			$element.attr('guid', guid);
			$scope.layers.push(guid);
			console.log(guid, $scope.layers);
		}
	}
}])
.directive('slidingPanelNav', [function() {
	return {
		restrict: 'A',
		link: function($scope: any, $element: any, attrs: any) {

		}
	}
}]);