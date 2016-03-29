module Playbook.Editor {
	export class Tool {
		title: string = 'Generic tool';
		guid: string = Common.Utilities.guid();
		tooltip: string = 'Generic tool';
		glyphicon: Icon.Glyphicon = new Icon.Glyphicon();
		action: Playbook.Editor.ToolActions = ToolActions.Nothing;
		cursor: string;
		mode: Playbook.Editor.ToolModes;
		selected: boolean;

		constructor(
			title?: string,
			action?: Playbook.Editor.ToolActions,
			glyphiconIcon?: string,
			tooltip?: string,
			cursor?: string,
			mode?: Playbook.Editor.ToolModes,
			selected?: boolean
		) {

			this.title = title || this.title;
			this.action = action || this.action;
			this.tooltip = tooltip || this.tooltip;
			this.glyphicon.icon = glyphiconIcon || this.glyphicon.icon;
			this.cursor = cursor || Playbook.Editor.CursorTypes.pointer;
			this.mode = mode || Playbook.Editor.ToolModes.Select;
			this.selected = selected || false;
		}
	}

	export enum ToolActions {
		Nothing,
		Select,
		ToggleMenu,
		AddPlayer,
		Save,
		ZoomIn,
		ZoomOut,
		Assignment
	}
}