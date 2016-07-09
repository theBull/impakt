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
			'playbookEditorCanvas',
			'playbook.editor.applicator.ctrl'
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

		if(self.tabs.isEmpty() || self.tabs.size() != self.scenarios.size()) {
			self.loadTabs();
		}

		if (!self.canvas) {
			self.canvas = new Playbook.Models.EditorCanvas();
		}
		
		self.canvas.clearListeners();
		self.canvas.setListener('onready', function() {
			
			self.loadTabs();
			
			// check for active tab and initialize the canvas with that tab's play
			self.tabs.forEach(function(tab: Common.Models.Tab, index: number) {
				if(tab.active) {

					// Get the scenario for the active tab
					let activeScenario = self.scenarios.filterFirst(function(scenario: Common.Models.Scenario, j: number) {
						return scenario.guid == tab.scenario.guid;
					});

					// load it up
					self.loadScenario(activeScenario);
				}
			});
			
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

		// ensure that each scenario in the editor context has
		// a correspondign tab
		this.scenarios.forEach(function(scenario: Common.Models.Scenario, index: number) {
			
			// pair up each scenario with its matching tab
			let matchFound = false;
			self.tabs.forEach(function(tab: Common.Models.Tab, j: number) {
				if (tab.scenario.guid == scenario.guid) {
					matchFound = true;	
				} 
			});

			if(!matchFound) {
				// No matching tab was found, so create a new
				// tab for the editor context scenario...
				let tab = new Common.Models.Tab(scenario);
				
				// ...set that tab to be active if it's the
				// first scenario in the editor context...
				tab.active = index == 0;

				// ...add the tab to the tabs collection
				self.addTab(tab);
			}				
		});
	}

	this.addTab = function(tab: Common.Models.Tab) {
		
		if (this.tabs.contains(tab.guid)) {
			// if the tab exists, activate it.
			this.activateTab(tab, true);
			return;
		} else {
			// the tab doesn't exist, add it to the collection
			this.tabs.add(tab, false);
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
			this.loadScenario(this.activeTab.scenario);
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
	this.refreshScenario = function() {
		if(Common.Utilities.isNotNullOrUndefined(this.activeTab))
			this.loadScenario(this.activeTab.scenario);
	}
	this.loadScenario = function(scenario: Common.Models.Scenario) {
		// allows for scenario to be null to effectively clear the field
		if(Common.Utilities.isNotNullOrUndefined(this.canvas) &&
			Common.Utilities.isNotNullOrUndefined(this.canvas.field)) {
			this.canvas.field.updateScenario(scenario);
		}
	}
	this.flipScenario = function() {
		if(Common.Utilities.isNotNullOrUndefined(this.canvas)) {
			this.canvas.field.primaryPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
				player.flip();
			});
			this.canvas.field.opponentPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
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
	 * Applies the given formation to the field
	 * @param {Common.Models.Formation} formation The Formation to apply
	 */
	this.applyFormation = function(formation: Common.Models.Formation, playType: Playbook.Enums.PlayTypes) {
		if(Common.Utilities.isNotNullOrUndefined(this.canvas) &&
			Common.Utilities.isNotNullOrUndefined(this.canvas.field)) {
			this.canvas.field.applyFormation(formation, playType);
		}
	}

	/**
	 * Applies the given personnel data to the field
	 * @param {Team.Models.Personnel} personnel The Personnel to apply
	 */
	this.applyPersonnel = function(personnel: Team.Models.Personnel, playType: Playbook.Enums.PlayTypes) {
		if(Common.Utilities.isNotNullOrUndefined(this.canvas) &&
			Common.Utilities.isNotNullOrUndefined(this.canvas.field)) {
			this.canvas.field.applyPersonnel(personnel, playType);
		}
	}

	/**
	 * Applies the given assignmentGroup data to the field
	 * @param {Common.Models.AssignmentGroup} assignmentGroup The AssignmentGroup to apply
	 */
	this.applyAssignmentGroup = function(assignmentGroup: Common.Models.AssignmentGroup, playType: Playbook.Enums.PlayTypes) {
		if(Common.Utilities.isNotNullOrUndefined(this.canvas) &&
			Common.Utilities.isNotNullOrUndefined(this.canvas.field)) {
			this.canvas.field.applyAssignmentGroup(assignmentGroup, playType);
		}
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

