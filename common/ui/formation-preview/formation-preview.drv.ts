/// <reference path='../ui.mdl.ts' />

impakt.common.ui.controller('formationPreview.ctrl', [
'$scope', '$timeout', function($scope: any, $timeout: any) {

	$scope.previewCanvas;
	$scope.play;
	$scope.formation;
	$scope.$element;
	$scope.isModified = true;
	$scope.modificationTimer;

	$scope.refresh = function() {
		if (!$scope.formation)
			throw new Error('formation-preview refresh(): Formation is null or undefined');
		if (!$scope.previewCanvas)
			throw new Error('formation-preview refresh(): PreviewCanvas is null or undefined');
		if (!$scope.$element)
			throw new Error('formation-preview refresh(): $element is null or undefined');
		
		$scope.$element.find('svg').show();
		$scope.previewCanvas.refresh();
		$scope.formation.png = $scope.previewCanvas.exportToPng();
		$scope.isModified = false;

		let scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute() 
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
			formation: '='
		},
		compile: function compile(tElement, tAttrs, transclude) {
			return {
				pre: function preLink($scope, $element, attrs, controller) { },
				post: function postLink($scope, $element, attrs, controller) {
					$scope.$element = $element;

					/**
					 * 
					 * Set up the play data to render the formation
					 * 
					 */
					if(!Common.Utilities.isNullOrUndefined($scope.formation)) {
						// check to see if the formation is being edited; 
						// in which case a temporary play has already been constructed
						// 
						// NOTE: if the play does not exist in the formations context,
						// it SHOULD NOT exist in the editor context.
						let editorPlay = impakt.context.Playbook.editor.plays.filterFirst(
							function(play: Common.Models.Play, index: number) {
								// - the play must have editorType: formation
								// - the play must have a formation
								// - the play formation guid must match the scope guid
								return play.editorType == Playbook.Enums.EditorTypes.Formation &&
									!Common.Utilities.isNullOrUndefined(play.formation) &&
									play.formation.guid == $scope.formation.guid;
							});

						if (!Common.Utilities.isNullOrUndefined(editorPlay)) {
							// there is a temp. play existing in the editor context,
							// so let's use that play to render the preview
							$scope.play = editorPlay;
						} else {
							// no play has been found to contain the formation,
							// draw a new play to render the preview
							$scope.play = new Common.Models.Play();
							$scope.play.setFormation($scope.formation);
						}

						if (Common.Utilities.isNullOrUndefined($scope.play))
							throw new Error('formation-preview post(): Play is null or undefined');

						$scope.play.editorType = Playbook.Enums.EditorTypes.Formation;

						// create a previewCanvas to handle preview creation. Creating
						// a previewCanvas will insert a SVG into the <formation-preview/> element
						// after the intialization phase.
						$scope.previewCanvas = new Playbook.Models.PreviewCanvas($scope.play, null);

					} else {
						// if there's no formation at this point, there's a problem
						throw new Error('formation-preview post(): Unable to find formation');
					}

					$scope.formation.onModified(function() {
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

							/**
							 * Set the base64 encoded PNG string on the formation
							 */
							$scope.formation.png = $scope.previewCanvas.exportToPng();
						}						
					}, 0);
				}
			}
		}
	}
}]);