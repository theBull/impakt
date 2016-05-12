/// <reference path='./playbook-editor.mdl.ts' />
/// <reference path='../playbook.ts' />
/// <reference path='../../../common/common.ts' />

declare var impakt: any;			

impakt.playbook.editor.service('_playbookEditor',
[
'$rootScope',
'$q',
'_base',
'_associations',
'_playbook',
'_playbookModals',
function(
	$rootScope: any,
	$q: any,
	_base: any, 
	_associations: any,
	_playbook: any,
	_playbookModals: any) {
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

	// tabs and plays are references to the targeted application-level data collections;
	// when the data changes at the application-level; tabs and plays added through this
	// service are handled by reference, so that no copies of them are created, unless
	// a *new* play is being created, or a play is being created as a *new copy* of another.
	// This keeps the data footprint minimal, as well as prevents the redundancy of 
	// data models existing application-wide. 
	this.tabs = impakt.context.Playbook.editor.tabs;
	this.plays = impakt.context.Playbook.editor.plays;
	this.formations = impakt.context.Playbook.editor.formations;

	// sets a default tab - this should be overwritten as soon as it becomes available
	this.activeTab = null;
	this.canvas = null;
	this.toolMode = Playbook.Enums.ToolModes[Playbook.Enums.ToolModes.None];

	$rootScope.$on('playbook-editor.refresh', 
	function(e: any, formationKey: any) {
		self.plays = impakt.context.Playbook.editor.plays;
		self.formations = impakt.context.Playbook.editor.formations;
		self.loadTabs();
	});

	this.readyCallback = function() {
		console.log('Playbook editor ready default callback');
	}
	let initialized = false;

	this.ready = function() {
		this.readyCallback();
	}

	this.init = function() {

		console.info('initializing playbook editor service');
		console.debug('service: impakt.playbook.editor - load complete');
		
		initialized = true;

		let initialPlay = null;

		if(self.tabs.isEmpty() || self.tabs.size() != self.plays.size()) {
			self.loadTabs();
		}

		// check for active tab and initialize the canvas with that tab's play
		self.tabs.forEach(function(tab, index) {
			if(tab.active) {
				initialPlay = self.plays.filterFirst(function(play) {
					return play.guid == tab.playPrimary.guid;
				});

				let associations = _associations.getAssociated(initialPlay);
				let assignmentGroup = associations.assignmentGroups.first();
				let formation = associations.formations.first();
				let personnel = associations.personnel.first();



				// let opponentPlayTest = new Common.Models.PlayOpponent();
				// // initialize the default formation & personnel
				// opponentPlayTest.setDefault(tab.canvas.field);


				if(initialPlay) {
					if(!self.canvas) {
						self.canvas = new Playbook.Models.EditorCanvas(
							initialPlay,
							null
						);
					}
				}
			}
		});		

		if(!initialPlay) {
			// Throw an error at this point; we should always have some physical play to use
			// whether it's a new play or an existing play; we shouldn't arbitrarily initialize
			// the canvas with a blank play here
			throw new Error('_playbookEditor init(): \
				Trying to create a new canvas but there are \
				no active tabs / play data to start with.');
		}
		
		self.canvas.clearListeners();
		self.canvas.onready(function() {
			self.loadTabs();
			self.ready();
		});

		_base.loadComponent(self.component);
	}

	this.onready = function(callback: Function) {
		this.readyCallback = callback;
	}

	/**
	 * Checks for open plays in the editor context, as well as the 
	 * corresponding tab; if the tab is active, grab the corresponding 
	 * play and pass it in to initialize the canvas.
	 */
	this.loadTabs = function() {
		this.plays.forEach(function(play, index) {
			// loop over all plays currently 'open' in the editor context...
			// determine whether each play has a corresponding tab 
			let playExists = false;
			self.tabs.forEach(function(tab, j) {
				if (tab.playPrimary.guid == play.guid) {
					playExists = true;	
				} 
			});
			if(!playExists) {
				let tab = new Common.Models.Tab(play, null);
				// Hmm...
				tab.active = index == 0;
				tab.unitType = play.unitType;
				self.addTab(tab);
			}				
		});
	}

	this.addTab = function(tab: Common.Models.Tab) {
		// ignore if it is already open
		if (this.tabs.contains(tab.guid)) {
			this.activateTab(tab, true);
			return;
		} else {
			// add the new tab...
			this.tabs.add(tab);
			this.activateTab(tab, false);			
		}		
	}
	this.activateTab = function(tab: Common.Models.Tab) {
		this.inactivateOtherTabs(tab);

		// for redundancy to ensure tab is explicitly set to active
		tab.active = true;

		// create another pointer to always track the active tab
		this.activeTab = tab;

		if(this.canvas) {
			// pass new data to canvas
			this.canvas.updatePlay(this.activeTab.playPrimary, null, true);			
		}		
	}
	this.closeTab = function(tab: Common.Models.Tab) {
		this.tabs.close(tab);

		// remove play from editor context
		this.plays.remove(tab.playPrimary.guid);
		
		// get last tab
		if (this.tabs.hasElements()) {
			// activate the last tab
			this.activateTab(this.tabs.getLast());
		} else {
			// no remaining tabs - nullify active Tab
			this.activeTab = null;
			this.canvas.clear();
		}

		// tell tab to close (fire off close callbacks)
		tab.close();
	}
	this.inactivateOtherTabs = function(tab: Common.Models.Tab) {
		this.tabs.forEach(
			function(currentTab, index) {
				if (currentTab.guid != tab.guid)
					currentTab.active = false;
			});
	}
	this.hasTabs = function(): boolean {
		return this.tabs.hasElements();
	}

	this.getEditorTypeClass = function(editorType: Playbook.Enums.EditorTypes) {
		return _playbook.getEditorTypeClass(editorType);
	}


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
		let activeTab = this.activeTab;
		console.log(activeTab);
		if (activeTab) {
			
			let play = activeTab.playPrimary;
			
			switch(play.editorType) {
				case Playbook.Enums.EditorTypes.Formation:
					_playbookModals.saveFormation(play);
					break;
				case Playbook.Enums.EditorTypes.Play:
					_playbookModals.savePlay(play);
					break;
			}
		}
	}

	this.zoomIn = function() {
		$rootScope.$broadcast('playbook-editor-canvas.zoomIn');
	}

	this.zoomOut = function() {
		$rootScope.$broadcast('playbook-editor-canvas.zoomOut');
	}

	this.setCursor = function(cursor: string) {
		if(this.canvas && this.canvas.$container) {
			this.canvas.$container.css({ 'cursor': cursor });
		}
	}

	this.setToolMode = function(toolMode: Playbook.Enums.ToolModes) {
		console.log('Change editor tool mode: ',
			toolMode, Playbook.Enums.ToolModes[toolMode]);
		if(this.canvas) {
			this.canvas.toolMode = toolMode;
			this.toolMode = Playbook.Enums.ToolModes[toolMode];
		}
	}

	this.toBrowser = function() {
		_playbook.toBrowser();
	}

	this.editFormation = function(formation: Common.Models.Formation) {
		_playbook.editFormation(formation);
		this.loadTabs();
	}

	this.editPlay = function(play: Common.Models.Play) {
		_playbook.editPlay(play);
		this.loadTabs();
	}

	/**
	 * Receives broadcast command from other services;
	 * loads all tabs according to any plays that have been
	 * added to the editor context.
	 */
	$rootScope.$on('playbook-editor.loadTabs', function(e: any, data: any) {
		self.loadTabs();
	});


}]);

