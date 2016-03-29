/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	export interface IPlayer extends Playbook.Interfaces.IFieldElement {
		guid: string;
		set: Playbook.Models.FieldElementSet;
		placement: Playbook.Models.Placement;
		assignment: Playbook.Models.Assignment;
		position: Playbook.Models.Position;
	}
}