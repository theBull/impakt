/// <reference path='./models.ts' />

module Playbook.Models {
	export class Tool {
		title: string = 'Generic tool';
		guid: string = Common.Utilities.guid();
		tooltip: string = 'Generic tool';
		glyphicon: Common.Icons.Glyphicon = new Common.Icons.Glyphicon();
		action: Playbook.Enums.ToolActions = Playbook.Enums.ToolActions.Nothing;
		cursor: string;
		mode: Playbook.Enums.ToolModes;
		selected: boolean;

		constructor(
			title?: string,
			action?: Playbook.Enums.ToolActions,
			glyphiconIcon?: string,
			tooltip?: string,
			cursor?: string,
			mode?: Playbook.Enums.ToolModes,
			selected?: boolean
		) {

			this.title = title || this.title;
			this.action = action || this.action;
			this.tooltip = tooltip || this.tooltip;
			this.glyphicon.icon = glyphiconIcon || this.glyphicon.icon;
			this.cursor = cursor || Common.Enums.CursorTypes.pointer;
			this.mode = mode || Playbook.Enums.ToolModes.Select;
			this.selected = selected || false;
		}
	}
}