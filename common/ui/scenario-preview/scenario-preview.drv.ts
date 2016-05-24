/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('scenarioPreview.ctrl', [
'$scope', '$timeout', function($scope: any, $timeout: any) {

	$scope.previewCanvas;
	$scope.scenario;
	$scope.$element;
	$scope.isModified = true;
	$scope.modificationTimer;

	$scope.refresh = function() {
		if (!$scope.scenario)
			throw new Error('scenario-preview refresh(): Play is null or undefined');
		if (!$scope.previewCanvas)
			throw new Error('scenario-preview refresh(): PreviewCanvas is null or undefined');
		if (!$scope.$element)
			throw new Error('scenario-preview refresh(): $element is null or undefined');
		
		$scope.$element.find('svg').show();
		$scope.previewCanvas.updateScenario($scope.scenario);
		$scope.scenario.png = $scope.previewCanvas.exportToPng();
		$scope.isModified = false;

		let scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute() - ($scope.$element.height() / 2);
		$scope.$element.scrollTop(scrollTop);

		if ($scope.modificationTimer)
			$timeout.cancel($scope.modificationTimer);
	}
	
}]).directive('scenarioPreview', [
'$timeout',
'_associations',
function(
	$timeout: any,
	_associations: any
) {
	/**
	 * scenario-preview directive renders an SVG preview canvas
	 * with the given scenario data.
	 */
	return {
		restrict: 'E',
		controller: 'scenarioPreview.ctrl',
		scope: {
			scenario: '='
		},
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					$scope.$element = $element;				

					// create a previewCanvas to handle preview creation. Creating
					// a previewCanvas will insert a SVG into the <scenario-preview/> element
					// after the intialization phase.
					if (Common.Utilities.isNotNullOrUndefined($scope.scenario)) {
						$scope.previewCanvas = new Playbook.Models.PreviewCanvas($scope.scenario);
					} else {
						// if there's no scenario at this point, there's a problem
						throw new Error('scenario-preview link(): Unable to find scenario');
					}

					$scope.scenario.onModified(function() {
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
						if($scope.previewCanvas) {
							$scope.previewCanvas.onready(function() {
								let scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute()
									- ($scope.$element.height() / 2);
								$scope.$element.scrollTop(scrollTop);
							});

							$scope.previewCanvas.initialize($element);
							$scope.scenario.png = $scope.previewCanvas.exportToPng();
						}						
					}, 0);
				}
			}
		}
	}
}]);