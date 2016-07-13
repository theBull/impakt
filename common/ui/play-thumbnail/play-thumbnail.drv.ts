/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('playThumbnail.ctrl', [
'$scope', function($scope: any) {
	
	$scope.play;

}]).directive('playThumbnail', [
function() {
	return {
		restrict: 'E',
		controller: 'playThumbnail.ctrl',
		scope: {
			play: '='
		},
		link: function($scope, $element, attrs) {
			$scope.$element = $element;

			// get height of $element
			let elementHeight = $element.height();
			let eventName = 'load.' + $scope.play.guid;
			
			let $img = $(new Image()).on(eventName, function(e) {
				
				let imgHeight = $(this).height();
				let imgOffsetTop = (-(imgHeight * 0.5) + (elementHeight / 2)) + 'px';
				$img.attr('style', 'top: ' + imgOffsetTop);

				// Clean up the event handler
				$img.off(eventName);

			}).error(function(e) {

				console.error('play-thumbnail: failed to load image.');

			}).prop('src', $scope.play.png);

			$element.append($img);
		}
	}
}]);