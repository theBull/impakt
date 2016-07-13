/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IPlay
	extends Common.Interfaces.IActionable,
	Common.Interfaces.IAssociable {

		playType: Playbook.Enums.PlayTypes;
		category: Playbook.Enums.PlayCategories;
		unitType: Team.Enums.UnitTypes;
		assignmentGroup: Common.Models.AssignmentGroup;
		formation: Common.Models.Formation;
		personnel: Team.Models.Personnel;
		name: string;
		key: number;

		setField(field: Common.Interfaces.IField): void;
		copy(newElement?: Common.Interfaces.IPlay): Common.Interfaces.IPlay;

	}

}