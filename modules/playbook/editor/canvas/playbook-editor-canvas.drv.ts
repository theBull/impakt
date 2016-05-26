///<reference path='./playbook-editor-canvas.mdl.ts' />

declare var impakt: any;

// TODO - needed?
impakt.playbook.editor.canvas.directive('playbookEditorCanvas', 
	['$rootScope', 
	'$compile', 
	'$templateCache',
	'$timeout',
	'_contextmenu',
	'_playPreview',
	'_playbookEditorCanvas', 
	'_scrollable',
	function(
		$rootScope: any, 
		$compile: any, 
		$templateCache: any, 
		$timeout: any,
		_contextmenu: any,
		_playPreview: any,
		_playbookEditorCanvas: any,
		_scrollable: any
	) {
	console.debug('directive: impakt.playbook.editor.canvas - register');
	
	return {
		restrict: 'E',
		link: function($scope: any, $element: any, attrs: any) {
			console.debug('directive: impakt.playbook.editor.canvas - link');

			$scope.canvas = _playbookEditorCanvas.getCanvas();

			// $timeout NOTE:
			// wrapping this step in a timeout due to a DOM rendering race.
			// The angular ng-show directive kicks in when activating/
			// deactivating the tabs, and the .col class (css-flex)
			// needs time itself to render to the appropriate size.
			// This timeout lets all of that finish before intializing
			// the canvas; the canvas requires an accurate $element height
			// value in order to get its proper dimensions.
			$timeout(function() {
				if ($scope.canvas) {

					$scope.canvas.onready(function() {
						let scrollTop = $scope.canvas.paper.field.getLOSAbsolute()
							- ($element.height() / 2);
						$element.scrollTop(scrollTop);
					
						if(Common.Utilities.isNotNullOrUndefined($scope.canvas.paper) &&
							Common.Utilities.isNotNullOrUndefined($scope.canvas.paper.field) &&
							Common.Utilities.isNotNullOrUndefined($scope.canvas.paper.field.los)) {
							$scope.canvas.paper.field.los.onModified(function() {
								let scrollTop = $scope.canvas.paper.field.getLOSAbsolute()
									- ($element.height() / 2);
								$element.scrollTop(scrollTop);			
							});
						}
					});

					$scope.canvas.initialize($element);

					// Listen for routenode contextmenu
					$scope.canvas.listener.listen(
						Playbook.Enums.Actions.RouteNodeContextmenu,
						function(data: Common.Models.ContextmenuData) {
							_contextmenu.open(data);
						}
					);

					/**
					 *
					 *	DEPRECATED
					 * 
					 */
					// canvas.setScrollable(_scrollable);

					// _scrollable.onready(function(content) {
					// 	_scrollable.scrollToPercentY(0.5);
					// 	_playPreview.setViewBox(
					// 		canvas.paper.x,
					// 		canvas.paper.y,
					// 		canvas.dimensions.width, 
					// 		canvas.dimensions.height
					// 	);
					// });

					// _scrollable.initialize(
					// 	$element,
					// 	canvas.paper
					// );
					/**
					 *
					 *  DEPRECATED
					 * 
					 */
				}
			}, 0);

			$(document).on('keydown', function(e: any) {
				//console.log(e.which);
				if(e.which == 8) { // backspace
					console.log('backspace pressed - playbook-editor-canvas.drv.ts');
				}
				if(e.which == 82) { // R
					console.log('R pressed - playbook-editor-canvas.drv.ts');
				}
				if(e.which == 65) { // A
					console.log('A pressed - playbook-editor-canvas.drv.ts');
					// find selected player
				}
			});

		}
	}

}]);

