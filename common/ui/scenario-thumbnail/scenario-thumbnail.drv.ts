/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('scenarioThumbnail.ctrl', [
'$scope', function($scope: any) {
	
	$scope.scenario;

}]).directive('scenarioThumbnail', [
function() {
	return {
		restrict: 'E',
		controller: 'scenarioThumbnail.ctrl',
		scope: {
			scenario: '='
		},
		
		link: function($scope, $element, attrs) {
			$scope.$element = $element;

			// get height of $element
			let elementHeight = $element.height();
			let eventName = 'load.' + $scope.scenario.guid;
			
			let $img = $(new Image()).on(eventName, function(e) {
				
				let imgHeight = $(this).height();
				let imgOffsetTop = (-(imgHeight * 0.5) + (elementHeight / 2)) + 'px';
				$img.attr('style', 'top: ' + imgOffsetTop);

				// Clean up the event handler
				$img.off(eventName);

			}).error(function(e) {

				console.error('scenario-thumbnail: failed to load image.');

			}).prop('src', $scope.scenario.png);

			$element.append($img);
		}
	}
}]);