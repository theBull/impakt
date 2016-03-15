/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	export interface IEditorObject {
		key: any;
		name: string;
		type: Playbook.Editor.UnitTypes;
		editorType: Playbook.Editor.EditorTypes;
		parentRK: number;
		personnel: Playbook.Models.Personnel;
		assignments: Playbook.Models.AssignmentCollection;
		formation: Playbook.Models.Formation;
		draw(field: Playbook.Models.Field): void;
	}
}

