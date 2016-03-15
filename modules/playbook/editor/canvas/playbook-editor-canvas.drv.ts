///<reference path='./playbook-editor-canvas.mdl.ts' />

declare var impakt: any;

// TODO - needed?
impakt.playbook.editor.canvas.directive('playbookEditorCanvas', 
	['$rootScope', 
	'$compile', 
	'$templateCache',
	'$timeout',
	'__contextmenu',
	'_playbookEditorCanvas', 
	'_scrollable',
	function(
		$rootScope: any, 
		$compile: any, 
		$templateCache: any, 
		$timeout: any,
		__contextmenu: any,
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


			// $rootScope.$on('playbook-editor-canvas.playerContextmenu',
			// 	function(e: any, data: any) {
					
			// 		var player = data.player;					
			// 		console.log('playbook-editor-canvas.playerContextmenu', player);

			// 		var markup = [
			// 			'<contextmenu ',
			// 			'guid="', 
			// 			player.guid, 
			// 			'" template="', 
			// 			player.contextmenuTemplateUrl,
			// 			'" left="', data.left, 
			// 			'" top="', data.top,
			// 			'"></contextmenu>'
			// 		].join('');

			// 		var c = $compile(markup)($scope);
					
			// 		__contextmenu.set(player.guid, player);
					
			// 		$element.after(c);
		
				
			// 	});

			$rootScope.$on('playbook-editor-canvas.routeNodeContextmenu',
				function(e: any, data: any) {
					
					var node = data.node;					
					console.log('playbook-editor-canvas.routeNodeContextmenu', node);

					var markup = [
						'<contextmenu ',
						'guid="', 
						node.guid, 
						'" template="', 
						node.contextmenuTemplateUrl,
						'" left="', data.left, 
						'" top="', data.top,
						'"></contextmenu>'
					].join('');

					var c = $compile(markup)($scope);
					
					__contextmenu.setContext(node);
					
					$element.after(c);
		
				
				});
		}
	}

}]);

