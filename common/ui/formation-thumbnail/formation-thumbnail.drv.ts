/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('formationThumbnail.ctrl', [
'$scope', function($scope: any) {
	
	$scope.formation;

}]).directive('formationThumbnail', [
function() {
	return {
		restrict: 'E',
		controller: 'formationThumbnail.ctrl',
		scope: {
			formation: '='
		},
		
		link: function($scope, $element, attrs) {
			$scope.$element = $element;

			// get height of $element
			let elementHeight = $element.height();
			let eventName = 'load.' + $scope.formation.guid;
			
			let $img = $(new Image()).on(eventName, function(e) {
				
				let imgHeight = $(this).height();
				let imgOffsetTop = (-(imgHeight * 0.5) + (elementHeight / 2)) + 'px';
				$img.attr('style', 'top: ' + imgOffsetTop);

				// Clean up the event handler
				$img.off(eventName);

			}).error(function(e) {

				console.error('formation-thumbnail: failed to load image.');

			}).prop('src', $scope.formation.png);

			$element.append($img);
		}
	}
}]);