/// <reference path='../../playbook.ts' />
/// <reference path='../../models/field/Canvas.ts' />
/// <reference path='../../../../common/common.ts' />
/// <reference path='./playbook-editor-canvas.mdl.ts' />

declare var impakt: any;

impakt.playbook.editor.canvas.service('_playbookEditorCanvas',[
	'$rootScope', 
	'$timeout', 
	'_base', 
	'_playbook',
	'_playbookEditor',
	function(
		$rootScope: any, 
		$timeout: any, 
		_base: any, 
		_playbook: any,
		_playbookEditor: any
	) {
		console.debug('service: impakt.playbook.editor.canvas');

		var self = this;
		this.playbookData = _playbookEditor.playbookData;
		this.playbooks = impakt.context.Playbook.playbooks;
		this.personnelCollection = impakt.context.Playbook.personnel;
		this.plays = impakt.context.Playbook.assignments;
		this.readyCallback = function() { console.log('canvas ready'); }

		this.component = new Common.Base.Component(
			'_playbookEditorCanvas',
			Common.Base.ComponentType.Service,
			[]
		);

		function init() {
			_playbookEditor.component.loadDependency(self.component);
		}

		this.onready = function(callback: Function) {
			this.readyCallback = callback;
		}
		this.ready = function() {
			this.readyCallback();
		}

		this.create = function(tab: Playbook.Models.Tab) {
			let canvas = new Playbook.Models.Canvas(tab.play);
			canvas.tab = tab;
			_playbookEditor.addCanvas(canvas);
		}

		this.initialize = function($element: any, editorType: number, guid: any)
			: Playbook.Models.Canvas {
			
			let canvas = _playbookEditor.canvases[guid];

			self.formations = impakt.context.Playbook.formations;
			
			// attach listeners to canvas
			// canvas.listen(
			// 	Playbook.Editor.CanvasActions.PlayerContextmenu, 
			// 	function(message: any, player: Playbook.Models.Player) {

			// 		console.log('action commanded: player contextmenu');

			// 		var absCoords = getAbsolutePosition(player.set.items[1]);
					
			// 		$rootScope.$broadcast(
			// 			'playbook-editor-canvas.playerContextmenu', 
			// 			{ 
			// 				message: message,
			// 				player: player,
			// 				left: absCoords.left,
			// 				top: absCoords.top
			// 			}
			// 		);

			// 	});

			canvas.listen(
				Playbook.Editor.CanvasActions.RouteNodeContextmenu, 
				function(message: any, node: Playbook.Models.RouteNode) {

					console.log('action commanded: route node contextmenu');

					var absCoords = getAbsolutePosition(node);
					
					$rootScope.$broadcast(
						'playbook-editor-canvas.routeNodeContextmenu', 
						{ 
							message: message,
							node: node,
							left: absCoords.left,
							top: absCoords.top
						}
					);

				});

			canvas.initialize($element);

			this.ready();
			
			return canvas;			
		}


		/**
		 * Applies the given formation to the field
		 * @param {Playbook.Models.Formation} formation The Formation to apply
		 */
		this.applyFormation = function(formation: Playbook.Models.Formation) {
			let activeCanvas = _playbookEditor.activeCanvas;
			activeCanvas.field.applyFormation(formation);
		}

		/**
		 * Applies the given personnel data to the field
		 * @param {Playbook.Models.Personnel} personnel The Personnel to apply
		 */
		this.applyPersonnel = function(personnel: Playbook.Models.Personnel) {
			let activeCanvas = _playbookEditor.activeCanvas;
			activeCanvas.field.applyPersonnel(personnel);
		}

		/**
		 * Applies the given play data to the field
		 * @param {Playbook.Models.Play} play The Play to apply
		 */
		this.applyPlay = function(play: Playbook.Models.Play) {
			let activeCanvas = _playbookEditor.activeCanvas;
			activeCanvas.field.applyPlay(play);
		}

		function getAbsolutePosition(element: Playbook.Models.FieldElement) {
			
			let $dom = $(element.raphael.node);

			console.log(
				'$dom offsets: ',
				$dom.offset().left,
				$dom.offset().top,
				element.width,
				element.height
			);

			//let $playbookCanvas = $dom.closest('playbook-editor-canvas');

			return {
				left: $dom.offset().left,
				top: $dom.offset().top
			};
		}

		this.remove = function(tab: Playbook.Models.Tab) {
			// do something
		}

		this.activate = function(activateCanvas: Playbook.Models.Canvas) {
			_playbookEditor.activateCanvas(activateCanvas);
		}

		this.scrollTo = function(x: number, y: number) {
			console.log(x, y);
			this.active.canvas.paper.scroll(x, y);
		}



		/*****
		*
		*
		*	RECEIVE EXTERNAL COMMANDS
		*
		*
		******/
		$rootScope.$on('playbook-editor-canvas.zoomIn',
			function(e: any, data: any) {
				self.active.canvas.paper.zoomIn();
			});

		$rootScope.$on('playbook-editor-canvas.zoomOut',
			function(e: any, data: any) {
				self.active.canvas.paper.zoomOut();
			});

		// receives command from playbook.editor to create a new canvas
		$rootScope.$on('playbook-editor-canvas.create', 
			function(e: any, tab: Playbook.Models.Tab) {
				console.log('creating canvas...');

				self.create(tab);
			});

		// receives command from playbook.editor to close canvas
		$rootScope.$on('playbook-editor-canvas.close',
			function(e: any, tab: Playbook.Models.Tab) {
				console.log('closing canvas...');

				self.remove(tab);
			});

		// receives command from playbook.editor to activate canvas
		$rootScope.$on('playbook-editor-canvas.activate',
			function(e: any, tab: Playbook.Models.Tab) {
				console.log('activating canvas...');

				self.activate(tab);
			});	

		// receives command from playbook.editor to add a player to canvas
		$rootScope.$on('playbook-editor-canvas.addPlayer',
			function(e: any, data: any) {
				//self.active.canvas.field.addPlayer({});
				console.info('add player');			
			});

		// receives command from playbook.editor to zoom in canvas
		$rootScope.$on('playbook-editor-canvas.zoomIn',
			function(e: any, data: any) {
				console.info('zoom in');			
			});

		// receives command from playbook.editor to zoom out canvas
		$rootScope.$on('playbook-editor-canvas.zoomOut',
			function(e: any, data: any) {
				console.info('zoom out');			
			});



		init();

}]);