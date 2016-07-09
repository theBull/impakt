/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('formationPreview.ctrl', [
'$scope', '$timeout', function($scope: any, $timeout: any) {

	$scope.previewCanvas;
	$scope.play;
	$scope.scenario;
	$scope.$element;
	$scope.isModified = true;
	$scope.modificationTimer;

	$scope.refresh = function() {
		if (!$scope.play)
			throw new Error('formation-preview refresh(): Play is null or undefined');
		if (!$scope.play.formation)
			throw new Error('formation-preview refresh(): Formation is null or undefined');
		if (!$scope.previewCanvas)
			throw new Error('formation-preview refresh(): PreviewCanvas is null or undefined');
		if (!$scope.$element)
			throw new Error('formation-preview refresh(): $element is null or undefined');
		
		$scope.$element.find('svg').show();
		$scope.previewCanvas.field.updateScenario($scope.scenario);
		$scope.play.formation.png = $scope.previewCanvas.exportToPng();
		$scope.isModified = false;

		let scrollTop = $scope.previewCanvas.field.getLOSAbsolute() 
			- ($scope.$element.height() / 2);
		$scope.$element.scrollTop(scrollTop);

		if ($scope.modificationTimer)
			$timeout.cancel($scope.modificationTimer);
	}
	
}]).directive('formationPreview', [
'$timeout',
function(
	$timeout: any
) {
	/**
	 * formation-preview directive renders an SVG preview canvas 
	 * with the given formation data.
	 */
	return {
		restrict: 'E',
		controller: 'formationPreview.ctrl',
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
					$scope.previewCanvas = new Playbook.Models.PreviewCanvas();

					if (Common.Utilities.isNullOrUndefined($scope.play)) {
						throw new Error('play-preview link(): Unable to find play');
					}

					$scope.play.onModified(function() {
						$scope.isModified = true;

						if ($scope.modificationTimer)
							$timeout.cancel($scope.modificationTimer);

						$scope.modificationTimer = $timeout(function() {
							console.log('auto refresh based on user changes');
							$scope.refresh();
						}, 200);
					});

					/**
					 * 
					 * NOTE: Due to the way angular renders directives,
					 * we have to wrap DOM-dependent code in a $timeout.
					 * 
					 */
					$timeout(function() {
						if ($scope.previewCanvas) {
							$scope.previewCanvas.setListener('onready', function() {
								let scrollTop = $scope.previewCanvas.field.getLOSAbsolute()
									- ($scope.$element.height() / 2);
								$scope.$element.scrollTop(scrollTop);
							});

							$scope.previewCanvas.initialize($element);

							$scope.scenario = new Common.Models.Scenario();
							$scope.scenario.setPlayPrimary($scope.play);
							$scope.scenario.setPlayOpponent(null);
							$scope.previewCanvas.field.updateScenario($scope.scenario);

							$scope.play.formation.png = $scope.previewCanvas.exportToPng();
						}
					}, 0);
				}
			}
		}
	}
}]);