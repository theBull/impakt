/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IActionable
	extends Common.Interfaces.IModifiable {

		impaktDataType: Common.Enums.ImpaktDataTypes;
		disabled: boolean;
		clickable: boolean;
		hoverable: boolean;
		selected: boolean;
		selectable: boolean;
		draggable: boolean;

		select(): void;
		deselect(): void;
		toggleSelect(): void;
		disable(): void;
		enable(): void;
	}

}