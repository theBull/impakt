/// <reference path='../../playbook.ts' />
/// <reference path='../../models/canvas/Canvas.ts' />
/// <reference path='../../../../common/common.ts' />
/// <reference path='./playbook-editor-canvas.mdl.ts' />

declare var impakt: any;

impakt.playbook.editor.canvas.service('_playbookEditorCanvas',[
	'$rootScope', 
	'$timeout', 
	'_base', 
	'_playPreview',
	'_playbook',
	'_playbookEditor',
	function(
		$rootScope: any, 
		$timeout: any, 
		_base: any, 
		_playPreview: any,
		_playbook: any,
		_playbookEditor: any
	) {
		console.debug('service: impakt.playbook.editor.canvas');

		var self = this;

		this.activeTab = _playbookEditor.activeTab;
		this.playbooks = impakt.context.Playbook.playbooks;
		this.formations = impakt.context.Playbook.formations;
		this.personnelCollection = impakt.context.Playbook.personnel;
		this.assignments = impakt.context.Playbook.assignments;
		this.plays = impakt.context.Playbook.assignments;
		this.readyCallbacks = [function() { console.log('canvas ready'); }]

		this.component = new Common.Base.Component(
			'_playbookEditorCanvas',
			Common.Base.ComponentType.Service,
			[]
		);

		function init() {
			_playbookEditor.component.loadDependency(self.component);
		}

		this.onready = function(callback: Function) {
			this.readyCallbacks.push(callback);
			_playbookEditor.onready(function() {
				self.ready();
			});
		}
		this.ready = function() {
			for(let i = 0; i < this.readyCallbacks.length; i++) {
				this.readyCallbacks[i]();
			}
			this.readyCallbacks = [];
		}

		this.create = function(tab: Playbook.Models.Tab) {
			// TODO @theBull - implement opponent play
			let canvas = new Playbook.Models.Canvas(
				tab.playPrimary,
				new Playbook.Models.PlayOpponent() 
			);
			canvas.tab = tab;
		}

		this.getActiveTab = function(): Playbook.Models.Tab {
			this.activeTab = _playbookEditor.activeTab;
			return this.activeTab;
		}

		this.hasTabs = function(): boolean {
			return _playbookEditor.hasTabs();
		}

		this.toBrowser = function(): void {
			_playbookEditor.toBrowser();
		}

		this.initialize = function($element: any, editorType: number, guid: any)
			: Playbook.Models.Canvas {
			
			let canvas = _playbookEditor.canvas;
			
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
			
			return canvas;			
		}


		/**
		 * Applies the given formation to the field
		 * @param {Playbook.Models.Formation} formation The Formation to apply
		 */
		this.applyPrimaryFormation = function(formation: Playbook.Models.Formation) {
			if(canApplyData()) {
				_playbookEditor.canvas.paper.field.applyPrimaryFormation(formation);	
			}
		}

		/**
		 * Applies the given personnel data to the field
		 * @param {Playbook.Models.Personnel} personnel The Personnel to apply
		 */
		this.applyPrimaryPersonnel = function(personnel: Playbook.Models.Personnel) {
			if(canApplyData()) {
				_playbookEditor.canvas.paper.field.applyPrimaryPersonnel(personnel);
			}
		}

		/**
		 * Applies the given play data to the field
		 * @param {Playbook.Models.Play} play The Play to apply
		 */
		this.applyPrimaryPlay = function(playPrimary: Playbook.Models.PlayPrimary) {
			if(canApplyData()) {
				_playbookEditor.canvas.paper.field.applyPlayPrimary(playPrimary);	
			}
		}

		function canApplyData(): boolean {
			if(!_playbookEditor.canvas ||
				!_playbookEditor.canvas.paper ||
				!_playbookEditor.canvas.paper.field) {
				throw new Error('Cannot apply primary formation; canvas, paper, or field is null or undefined');
				return false;
			}
			return true;
		}

		function getAbsolutePosition(element: Playbook.Models.RouteNode) {
			
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

		this.scrollTo = function(x: number, y: number) {
			console.log(x, y);
			this.canvas.paper.scroll(x, y);
		}

		this.getEditorTypeClass = function(editorType: Playbook.Editor.EditorTypes) {
			return _playbookEditor.getEditorTypeClass(editorType);
		}



		/*****
		*
		*
		*	RECEIVE EXTERNAL COMMANDS
		*
		*
		******/
		// receives command from playbook.editor to create a new canvas
		$rootScope.$on('playbook-editor-canvas.create',
			function(e: any, tab: Playbook.Models.Tab) {
				console.log('creating canvas...');

				self.create(tab);
			});

		$rootScope.$on('playbook-editor-canvas.zoomIn',
			function(e: any, data: any) {
				//self.active.canvas.paper.zoomIn();
			});

		$rootScope.$on('playbook-editor-canvas.zoomOut',
			function(e: any, data: any) {
				//self.active.canvas.paper.zoomOut();
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