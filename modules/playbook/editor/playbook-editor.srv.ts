/// <reference path='./playbook-editor.mdl.ts' />
/// <reference path='../playbook.ts' />
/// <reference path='../../../common/common.ts' />

declare var impakt: any;			

impakt.playbook.editor.service('_playbookEditor',
[
'$rootScope', 
'__modals',
'_base', 
'_playbook', 
'_playbookBrowser',
function(
	$rootScope: any, 
	__modals: any,
	_base: any, 
	_playbook: any,
	_playbookBrowser: any) {
	console.debug('service: impakt.playbook.editor')

	let self = this;
	this.component = new Common.Base.Component(
		'_playbookEditor',
		Common.Base.ComponentType.Service,
		[
			'_playbookEditorTools',
			'_playbookEditorTabs',
			'_playbookEditorCanvas'
		]
	);

	this.tabs = new Playbook.Models.TabCollection();
	this.canvases = {};
	this.activeCanvas = null;

	this.editorMode = Playbook.Editor.EditorModes[Playbook.Editor.EditorModes.None];

	this.playbookData = _playbookBrowser.playbookData;
	this.initializeData = null;


	function init() {

		self.component.onready(function(c) {
			console.debug('service: impakt.playbook.editor - load complete');

			if(self.initializeData) {
				// load data into a new tab
				$rootScope.$broadcast(
					'playbook-editor-tab.open', 
					self.initializeData
				);
			} else {
				// open a new tab
				// $rootScope.$broadcast(
				// 	'playbook-editor-tab.new', {}
				// );
			}

					
		});

		_base.loadComponent(self.component);
	}

	this.addTab = function(play: Playbook.Models.Play) {
		let existingTab = this.tabs.getByPlayGuid(play.guid);
		// ignore if it is already open
		if (existingTab) {
			this.activateTab(existingTab, true);
			return;
		}

		let tab = new Playbook.Models.Tab(play);
		this.tabs.add(tab.guid, tab);

		// activate this tab (will activate the canvas as well)
		this.activateTab(tab, false);
						
		// create a new canvas in the editor
		$rootScope.$broadcast('playbook-editor-canvas.create', tab);
	}
	this.activateTab = function(tab: Playbook.Models.Tab, activateCanvas?: boolean) {
		this.inactivateOtherTabs(tab);
		this.tabs.get(tab.guid).active = true;

		if (activateCanvas) {
			let canvas = this.canvases[tab.guid];
			this.activateCanvas(canvas);
		}
		
	}
	this.closeTab = function(tab: Playbook.Models.Tab) {
		this.tabs.remove(tab.guid);
		
		let canvas = this.canvases[tab.guid];
		if(canvas.active) {
			this.activeCanvas = null;
		}
		delete this.canvases[tab.guid];
	}
	this.inactivateOtherTabs = function(tab: Playbook.Models.Tab) {
		this.tabs.forEach(function(currentTab, index) {
			if (currentTab.guid != tab.guid)
				currentTab.active = false;
		});
	}

	this.addCanvas = function(canvas: Playbook.Models.Canvas) {
		this.canvases[canvas.tab.guid] = canvas;
		this.activateCanvas(canvas);
	}

	this.activateCanvas = function(canvas: Playbook.Models.Canvas) {
		this.inactivateOtherCanvases(canvas);
		this.canvases[canvas.tab.guid].active = true;
		this.activeCanvas = canvas;
	}
	this.getActiveCanvas = function() {
		return this.activeCanvas;
	}

	this.inactivateOtherCanvases = function(canvas: Playbook.Models.Canvas) {
		for (let tabGuid in this.canvases) {
			let someCanvas = this.canvases[tabGuid];
			if (someCanvas.tab.guid != canvas.tab.guid)
				someCanvas.active = false;
		}
	}

	// this.createCanvas = function(tab: Playbook.Editor.Tab) {
	// 	console.info('create canvas: ', tab.guid);
	// 	$rootScope.$broadcast('playbook-editor-canvas.create', { tab: tab });
	// }

	// this.closeCanvas = function(tab: Playbook.Editor.Tab) {
	// 	console.info('close tab: ', tab.guid);
	// 	$rootScope.$broadcast('playbook-editor-canvas.close', { tab: tab });
	// }

	$rootScope.$on('playbook.deleteFormation', 
		function(e: any, formationKey: any) {
			throw new Error('remove tab on delete of formation not implemented');
		});

	/*
	*
	*	Tool -> Canvas bindings
	*
	*/
	this.toggleMenu = function() {
		// N/A
	}
	this.addPlayer = function() {
		$rootScope.$broadcast('playbook-editor-canvas.addPlayer');
	}

	this.save = function() {
		// save the data for the active item
		let activeCanvas = this.getActiveCanvas();
		console.log(activeCanvas);
		if(activeCanvas) {
			let data = activeCanvas.play;

			let modalInstance = __modals.open(
				'',
				'modules/playbook/modals/save-play/save-play.tpl.html',
				'playbook.modals.savePlay.ctrl',
				{
					personnel: function() {
						return data.personnel;
					},
					assignmentCollection: function() {
						return data.assignments;
					},
					formation: function() {
						return data.formation;
					}
				}
			);

			modalInstance.result.then(function(createdPlay) {
				console.log(createdPlay);
			}, function(results) {
				console.log('dismissed');
			});
		}
	}

	this.zoomIn = function() {
		$rootScope.$broadcast('playbook-editor-canvas.zoomIn');
	}

	this.zoomOut = function() {
		$rootScope.$broadcast('playbook-editor-canvas.zoomOut');
	}

	this.setCursor = function(cursor: string) {
		if(this.activeCanvas && this.activeCanvas.$container) {
			this.activeCanvas.$container.css({ 'cursor': cursor });
		}
	}

	this.setEditorMode = function(editorMode: Playbook.Editor.EditorModes) {
		console.log('Change editor mode: ',
			editorMode, Playbook.Editor.EditorModes[editorMode]);
		if(this.activeCanvas) {
			this.activeCanvas.editorMode = editorMode;
			this.editorMode = Playbook.Editor.EditorModes[editorMode];
		}
	}

	init();

}]);

