/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tools.mdl.ts' />
/// <reference path='../playbook-editor.srv.ts' />

declare var impakt: any;

impakt.playbook.editor.tools.service('_playbookEditorTools',
['$rootScope', '_base', '_playbookEditor', 
function($rootScope: any, _base: any, _playbookEditor: any) {
	console.debug('service: impakt.Playbook.Models.tools')

	this.component = new Common.Base.Component(
		'_playbookEditorTools',
		Common.Base.ComponentType.Service,
		[
			'Playbook.Models.tools.ctrl'
		]
	);
	function init(self) {
		_playbookEditor.component.loadDependency(self.component);
	}

	this.tools = [
		new Playbook.Models.Tool(
			'Toggle menu',
			Playbook.Enums.ToolActions.ToggleMenu,
			'menu-hamburger'
		),
		new Playbook.Models.Tool(
			'Save',
			Playbook.Enums.ToolActions.Save,
			'floppy-disk'
		),
		new Playbook.Models.Tool(
			'Select',
			Playbook.Enums.ToolActions.Select,
			'hand-up',
			'Select',
			Common.Enums.CursorTypes.pointer,
			Playbook.Enums.ToolModes.Select,
			true
		),
		new Playbook.Models.Tool(
			'Assignment',
			Playbook.Enums.ToolActions.Assignment,
			'screenshot',
			'',
			Common.Enums.CursorTypes.crosshair,
			Playbook.Enums.ToolModes.Assignment
		),
		// new Playbook.Models.Tool(
		// 	'Add player',
		// 	Playbook.Enums.ToolActions.AddPlayer,
		// 	'user'
		// 	),
		// new Playbook.Models.Tool(
		// 	'Zoom in',
		// 	Playbook.Enums.ToolActions.ZoomIn,
		// 	'zoom-in'
		// 	),
		// new Playbook.Models.Tool(
		// 	'Zoom out',
		// 	Playbook.Enums.ToolActions.ZoomOut, 
		// 	'zoom-out'
		// 	),
	];

	this.deselectAll = function() {
		for (let i = 0; i < this.tools.length; i++) {
			this.tools[i].selected = false;
		}
	}

	this.invoke = function(tool: Playbook.Models.Tool) {
		this.deselectAll();
		tool.selected = true;
		switch (tool.action) {
			
			case Playbook.Enums.ToolActions.Select:
				break;

			case Playbook.Enums.ToolActions.ToggleMenu:
				this.toggleMenu();
				break;

			case Playbook.Enums.ToolActions.AddPlayer: 
				this.addPlayer();
				break;

			case Playbook.Enums.ToolActions.Save:
				this.save();
				break;

			case Playbook.Enums.ToolActions.ZoomIn:
				this.zoomIn();
				break;

			case Playbook.Enums.ToolActions.ZoomOut:
				this.zoomOut();
				break;

			case Playbook.Enums.ToolActions.Assignment:
				alert('NOTE: Assignment functionality is in development. Thanks for your patience!');
				break;

		}

		this.setCursor(tool.cursor);
		this.setToolMode(tool.mode);
	}
	
	/*
	*	TOOL BINDINGS
	*/
	this.toggleMenu = function() {
		$rootScope.$broadcast('playbook-editor-canvas.toggleMenu');
	}
	this.addPlayer = function() {
		_playbookEditor.addPlayer();
	}

	this.save = function() {
		_playbookEditor.save();	
	}

	this.zoomIn = function() {
		_playbookEditor.zoomIn();
	}

	this.zoomOut = function() {
		_playbookEditor.zoomOut();
	}

	this.setCursor = function(cursor) {
		_playbookEditor.setCursor(cursor);
	}

	this.setToolMode = function(mode) {
		_playbookEditor.setToolMode(mode);
	}


	init(this);

}]);