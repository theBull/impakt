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
		scope: {
			editortype: '@editortype',
			key: '@key'
		},
		link: function($scope: any, $element: any, attrs: any) {
			console.debug('directive: impakt.playbook.editor.canvas - link');
			// angular doesn't respect camel-casing in directives, hence
			// the all-lowercased editortype attribute.
			let editorType = parseInt(attrs.editortype);
			let key = attrs.key;

			$timeout(function() {
				
				// $timeout NOTE:
				// wrapping this step in a timeout due to a DOM rendering race.
				// The angular ng-show directive kicks in when activating/
				// deactivating the tabs, and the .col class (css-flex)
				// needs time itself to render to the appropriate size.
				// This timeout lets all of that finish before intializing
				// the canvas; the canvas requires an accurate $element height
				// value in order to get its proper dimensions.
			
				let canvas = _playbookEditorCanvas.initialize(
					$element, editorType, key
				);
				canvas.setScrollable(_scrollable);

				_scrollable.onready(function(content) {
					_scrollable.scrollToPercentY(0.5);
					_playPreview.setViewBox(
						canvas.paper.x,
						canvas.paper.y,
						canvas.dimensions.width, 
						canvas.dimensions.height
					);
				});

				_scrollable.initialize(
					$element,
					canvas.paper
				);

			});

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

