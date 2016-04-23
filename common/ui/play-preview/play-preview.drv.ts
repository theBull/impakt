/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('playPreview.ctrl', [
'$scope', '$timeout', function($scope: any, $timeout: any) {

	$scope.previewCanvas;
	$scope.play;
	$scope.$element;
	$scope.isModified = true;
	$scope.modificationTimer;

	$scope.refresh = function() {
		if (!$scope.play)
			throw new Error('play-preview refresh(): Play is null or undefined');
		if (!$scope.previewCanvas)
			throw new Error('play-preview refresh(): PreviewCanvas is null or undefined');
		if (!$scope.$element)
			throw new Error('play-preview refresh(): $element is null or undefined');
		
		$scope.$element.find('svg').show();
		$scope.previewCanvas.refresh();
		$scope.play.png = $scope.previewCanvas.exportToPng();
		$scope.isModified = false;

		let scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute() - ($scope.$element.height() / 2);
		$scope.$element.scrollTop(scrollTop);

		if ($scope.modificationTimer)
			$timeout.cancel($scope.modificationTimer);
	}
	
}]).directive('playPreview', [
'$timeout',
function(
	$timeout: any
) {
	/**
	 * play-preview directive renders an SVG preview canvas
	 * with the given play data.
	 */
	return {
		restrict: 'E',
		controller: 'playPreview.ctrl',
		scope: {
			play: '='
		},
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					$scope.$element = $element;				

					// create a previewCanvas to handle preview creation. Creating
					// a previewCanvas will insert a SVG into the <play-preview/> element
					// after the intialization phase.
					if (!Common.Utilities.isNullOrUndefined($scope.play)) {
						$scope.previewCanvas = new Playbook.Models.PreviewCanvas($scope.play, null);
					} else {
						// if there's no play at this point, there's a problem
						throw new Error('play-preview link(): Unable to find play');
					}

					$scope.play.onModified(function() {
						$scope.isModified = true;

						if ($scope.modificationTimer)
							$timeout.cancel($scope.modificationTimer);

						$scope.modificationTimer = $timeout(function() {
							console.log('auto refresh based on user changes');
							$scope.refresh();
						}, 500);
					});

					/**
					 * 
					 * NOTE: Due to the way angular renders directives,
					 * we have to wrap DOM-dependent code in a $timeout.
					 * 
					 */
					$timeout(function() {
						if($scope.previewCanvas) {
							$scope.previewCanvas.onready(function() {
								let scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute()
									- ($scope.$element.height() / 2);
								$scope.$element.scrollTop(scrollTop);
							});

							$scope.previewCanvas.initialize($element);
							$scope.play.png = $scope.previewCanvas.exportToPng();
						}						
					}, 0);
				}
			}
		}
	}
}]);