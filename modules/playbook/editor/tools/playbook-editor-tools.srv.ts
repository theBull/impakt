/// <reference path='./Tool.ts' />
/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tools.mdl.ts' />
/// <reference path='../playbook-editor.srv.ts' />

declare var impakt: any;

impakt.playbook.editor.tools.service('_playbookEditorTools',
['$rootScope', '_base', '_playbookEditor', 
function($rootScope: any, _base: any, _playbookEditor: any) {
	console.debug('service: impakt.playbook.editor.tools')

	this.component = new Common.Base.Component(
		'_playbookEditorTools',
		Common.Base.ComponentType.Service,
		[
			'playbook.editor.tools.ctrl'
		]
	);
	function init(self) {
		_playbookEditor.component.loadDependency(self.component);
	}

	this.tools = [
		new Playbook.Editor.Tool(
			'Toggle menu',
			Playbook.Editor.ToolActions.ToggleMenu,
			'menu-hamburger'
			),
		new Playbook.Editor.Tool(
			'Select',
			Playbook.Editor.ToolActions.Select,
			'hand-up',
			'Select',
			Playbook.Editor.CursorTypes.pointer,
			Playbook.Editor.EditorModes.Select,
			true
		),
		new Playbook.Editor.Tool(
			'Add player',
			Playbook.Editor.ToolActions.AddPlayer,
			'user'
			),
		new Playbook.Editor.Tool(
			'Save',
			Playbook.Editor.ToolActions.Save,
			'floppy-save'
			),
		new Playbook.Editor.Tool(
			'Zoom in',
			Playbook.Editor.ToolActions.ZoomIn,
			'zoom-in'
			),
		new Playbook.Editor.Tool(
			'Zoom out',
			Playbook.Editor.ToolActions.ZoomOut, 
			'zoom-out'
			),
		new Playbook.Editor.Tool(
			'Assignment',
			Playbook.Editor.ToolActions.Assignment,
			'screenshot',
			'',
			Playbook.Editor.CursorTypes.crosshair,
			Playbook.Editor.EditorModes.Assignment
			)
	];

	this.deselectAll = function() {
		for (let i = 0; i < this.tools.length; i++) {
			this.tools[i].selected = false;
		}
	}

	this.invoke = function(tool: Playbook.Editor.Tool) {
		this.deselectAll();
		tool.selected = true;
		switch (tool.action) {
			
			case Playbook.Editor.ToolActions.Select:
				break;

			case Playbook.Editor.ToolActions.ToggleMenu:
				this.toggleMenu();
				break;

			case Playbook.Editor.ToolActions.AddPlayer: 
				this.addPlayer();
				break;

			case Playbook.Editor.ToolActions.Save:
				this.save();
				break;

			case Playbook.Editor.ToolActions.ZoomIn:
				this.zoomIn();
				break;

			case Playbook.Editor.ToolActions.ZoomOut:
				this.zoomOut();
				break;

			case Playbook.Editor.ToolActions.Assignment:
				break;

		}

		this.setCursor(tool.cursor);
		this.setEditorMode(tool.editorMode);
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

	this.setEditorMode = function(mode) {
		_playbookEditor.setEditorMode(mode);
	}


	init(this);

}]);