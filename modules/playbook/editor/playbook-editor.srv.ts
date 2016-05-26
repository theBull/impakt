/// <reference path='./playbook-editor.mdl.ts' />

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

	this.tabs = impakt.context.Playbook.editor.tabs;
	this.scenarios = impakt.context.Playbook.editor.scenarios;

	// sets a default tab - this should be overwritten as soon as it becomes available
	this.activeTab = null;
	this.canvas = null;
	this.toolMode = Playbook.Enums.ToolModes[Playbook.Enums.ToolModes.None];

	$rootScope.$on('playbook-editor.refresh', 
	function(e: any, formationKey: any) {
		self.scenarios = impakt.context.Playbook.editor.scenarios;
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
		
		initialized = true;

		var activeScenario = null;

		if(self.tabs.isEmpty() || self.tabs.size() != self.scenarios.size()) {
			self.loadTabs();
		}

		// check for active tab and initialize the canvas with that tab's play
		self.tabs.forEach(function(tab: Common.Models.Tab, index: number) {
			if(tab.active) {

				activeScenario = self.scenarios.filterFirst(function(scenario: Common.Models.Scenario, j: number) {
					return scenario.guid == tab.scenario.guid;
				});

				// if(Common.Utilities.isNotNullOrUndefined(tab.scenario) &&
				// 	Common.Utilities.isNotNullOrUndefined(activeScenario)) {
				// 	if (Common.Utilities.isNotNullOrUndefined(tab.scenario.playPrimary)) {
				// 		_initializePlay(tab.scenario.playPrimary, tab);
				// 	}
				// 	if(Common.Utilities.isNotNullOrUndefined(tab.scenario.playOpponent)) {
				// 		_initializePlay(tab.scenario.playOpponent, tab);
				// 	}
				// }	
			}
		});

		if (activeScenario) {
			if (!self.canvas) {
				self.canvas = new Playbook.Models.EditorCanvas(activeScenario);
				self.editorType = activeScenario.editorType;
			}
		}

		if (!activeScenario) {
			// Throw an error at this point; we should always have some physical play to use
			// whether it's a new play or an existing play; we shouldn't arbitrarily initialize
			// the canvas with a blank play here
			throw new Error('_playbookEditor init(): Trying to create a new canvas but there are no active tabs / scenario data to start with.');
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

	this.getEditorType = function() {
		return this.editorType;
	}

	/**
	 * Checks for open scenarios in the editor context, as well as the 
	 * corresponding tab; if the tab is active, grab the corresponding 
	 * scenario and pass it in to initialize the canvas.
	 */
	this.loadTabs = function() {
		this.scenarios.forEach(function(scenario: Common.Models.Scenario, index: number) {
			// loop over all scenarios currently 'open' in the editor context...
			// determine whether each scenario has a corresponding tab 
			let scenarioExists = false;
			self.tabs.forEach(function(tab: Common.Models.Tab, j: number) {
				if (tab.scenario.guid == scenario.guid) {
					scenarioExists = true;	
				} 
			});
			if(!scenarioExists) {
				let tab = new Common.Models.Tab(scenario);
				// Hmm...
				tab.active = index == 0;
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
			this.canvas.updateScenario(this.activeTab.scenario, true);
		}		
	}
	this.closeTab = function(tab: Common.Models.Tab) {
		this.tabs.close(tab);

		// remove play from editor context
		this.scenarios.remove(tab.scenario.guid);
		
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

	this.flipScenario = function() {
		if(Common.Utilities.isNotNullOrUndefined(this.canvas)) {
			this.canvas.paper.field.primaryPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
				player.flip();
			});
			this.canvas.paper.field.opponentPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
				player.flip();
			});
		}
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
		if (Common.Utilities.isNotNullOrUndefined(activeTab)) {
			
			let scenario = activeTab.scenario;
			
			switch(scenario.editorType) {
				case Playbook.Enums.EditorTypes.Formation:
					_playbookModals.saveFormation(scenario.playPrimary);
					break;
				case Playbook.Enums.EditorTypes.Play:
					_playbookModals.savePlay(scenario.playPrimary);
					break;
				case Playbook.Enums.EditorTypes.Scenario:
					_playbookModals.saveScenario(scenario);
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

	this.editScenario = function(scenario: Common.Models.Scenario) {
		_playbook.editScenario(scenario);
		this.loadTabs();
	}

	this.editPlay = function(play: Common.Models.Play) {
		_playbook.editPlay(play);
		this.loadTabs();
	}

	this.editFormation = function(formation: Common.Models.Formation) {
		_playbook.editFormation(formation);
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

