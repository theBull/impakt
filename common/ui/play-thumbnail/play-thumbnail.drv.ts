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
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					$scope.$element = $element;

					// get height of $element
					let elementHeight = $element.height();

					let img = document.createElement('img');
					img.src = $scope.play.png;
					let $img = $(img);
					$scope.$element.append($img);

					img.addEventListener('load', function() { 
						let imgHeight = $img.height();
						let imgOffsetTop = (-(imgHeight * 0.5) + (elementHeight / 2)) + 'px';
						$img.css({ 'top': imgOffsetTop });
					}, false);
				}
			}
		}
	}
}]);