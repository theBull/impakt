/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IPlay
	extends Common.Interfaces.IActionable {

		playType: Playbook.Enums.PlayTypes;
		unitType: Team.Enums.UnitTypes;
		assignmentGroup: Common.Models.AssignmentGroup;
		formation: Common.Models.Formation;
		personnel: Team.Models.Personnel;
		name: string;

		setField(field: Common.Interfaces.IField): void;
		copy(newElement?: Common.Interfaces.IPlay): Common.Interfaces.IPlay;

	}

}