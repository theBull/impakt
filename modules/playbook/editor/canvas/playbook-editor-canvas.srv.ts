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
		this.personnelCollection = impakt.context.Team.personnel;
		this.assignments = impakt.context.Playbook.assignments;
		this.plays = impakt.context.Playbook.plays;
		this.readyCallbacks = [function() { console.log('canvas ready'); }]
		this.canvas = _playbookEditor.canvas;

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

		this.create = function(tab: Common.Models.Tab) {
			// TODO @theBull - implement opponent play
			let canvas = new Playbook.Models.EditorCanvas(
				tab.playPrimary,
				new Common.Models.PlayOpponent() 
			);
			canvas.tab = tab;
		}

		this.getActiveTab = function(): Common.Models.Tab {
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
			: Common.Interfaces.ICanvas {
			
			let canvas = _playbookEditor.canvas;
			
			// attach listeners to canvas
			// canvas.listen(
			// 	Playbook.Editor.CanvasActions.PlayerContextmenu, 
			// 	function(message: any, player: Common.Models.Player) {

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

			canvas.listener.listen(
				Playbook.Enums.Actions.RouteNodeContextmenu, 
				function(node: Common.Models.RouteNode) {

					console.log('action commanded: route node contextmenu');

					var absCoords = getAbsolutePosition(node);
					
					$rootScope.$broadcast(
						'playbook-editor-canvas.routeNodeContextmenu', 
						{ 
							message: 'contextmenu opened',
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
		 * @param {Common.Models.Formation} formation The Formation to apply
		 */
		this.applyPrimaryFormation = function(formation: Common.Models.Formation) {
			if(canApplyData()) {
				_playbookEditor.canvas.paper.field.applyPrimaryFormation(formation);	
			}
		}

		/**
		 * Applies the given personnel data to the field
		 * @param {Team.Models.Personnel} personnel The Personnel to apply
		 */
		this.applyPrimaryPersonnel = function(personnel: Team.Models.Personnel) {
			if(canApplyData()) {
				_playbookEditor.canvas.paper.field.applyPrimaryPersonnel(personnel);
			}
		}

		/**
		 * Applies the given play data to the field
		 * @param {Common.Models.Play} play The Play to apply
		 */
		this.applyPrimaryPlay = function(playPrimary: Common.Models.PlayPrimary) {
			if(canApplyData()) {
				_playbookEditor.canvas.paper.field.applyPlayPrimary(playPrimary);	
			}
		}

		function canApplyData(): boolean {
			if(!_playbookEditor.canvas ||
				!_playbookEditor.canvas.paper ||
				!_playbookEditor.canvas.paper.field) {
				throw new Error('Cannot apply primary formation; canvas, paper, or field is null or undefined');
			}
			return true;
		}

		function getAbsolutePosition(element: Common.Models.RouteNode) {
			
			let $dom = $(element.layer.graphics.raphael.node);

			console.log(
				'$dom offsets: ',
				$dom.offset().left,
				$dom.offset().top,
				element.layer.graphics.dimensions.width,
				element.layer.graphics.dimensions.height
			);

			//let $playbookCanvas = $dom.closest('playbook-editor-canvas');

			return {
				left: $dom.offset().left,
				top: $dom.offset().top
			};
		}

		this.remove = function(tab: Common.Models.Tab) {
			// do something
		}

		this.scrollTo = function(x: number, y: number) {
			console.log(x, y);
			this.canvas.paper.scroll(x, y, true);
		}

		this.getEditorTypeClass = function(editorType: Playbook.Enums.EditorTypes) {
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
			function(e: any, tab: Common.Models.Tab) {
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
			function(e: any, tab: Common.Models.Tab) {
				console.log('closing canvas...');

				self.remove(tab);
			});

		// receives command from playbook.editor to activate canvas
		$rootScope.$on('playbook-editor-canvas.activate',
			function(e: any, tab: Common.Models.Tab) {
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