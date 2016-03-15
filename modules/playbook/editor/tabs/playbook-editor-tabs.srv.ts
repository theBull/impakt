/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tabs.mdl.ts' />

impakt.playbook.editor.tabs.service('_playbookEditorTabs',
	['$rootScope', '_base', '_playbookEditor', 
	function($rootScope: any, _base: any, _playbookEditor: any) {
		console.debug('service: impakt.playbook.editor.tabs')
		
		let self = this;
		this.component = new Common.Base.Component(
			'_playbookEditorTabs',
			Common.Base.ComponentType.Service,
			[
				'playbook.editor.tabs.ctrl'
			]
		);

		function init() {
			_playbookEditor.component.loadDependency(self.component);
		}

		this.open = function(play: Playbook.Models.Play) {
			console.log('open tab with data: ', play);

			_playbookEditor.addTab(play);
		}
		$rootScope.$on('playbook-editor-tab.open',
			function(e: any, play: any) {
				self.open(
					play
				);
			});

		this.newFormation = function(formationName: string) {
			console.log('new formation', formationName);
		}

		this.new = function() {
			console.log('creating new tab...');
						
			// Step 2: build a generic model from that response
			this.open(null);
		}	
		$rootScope.$on('playbook-editor-tab.new',
			function(e: any, data: any) {
				self.new();
			});

		this.close = function(tab: Playbook.Models.Tab) {
			// remove the tab from the array			
			_playbookEditor.closeTab(tab);
		}

		this.activate = function(tab: Playbook.Models.Tab, activateCanvas: boolean) {
			_playbookEditor.activateTab(tab, true);
		}

		this.getTabs = function() {
			return _playbookEditor.tabs;
		}

		this.getCanvases = function() {
			return _playbookEditor.canvases;
		}

		init();

	}]);