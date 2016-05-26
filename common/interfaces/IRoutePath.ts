/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IRoutePath
	extends Common.Interfaces.IFieldElement {
		pathString: string;
		unitType: Team.Enums.UnitTypes;

		draw(): void;
		remove(): void;
	}
}