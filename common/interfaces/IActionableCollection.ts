/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IActionableCollection
	extends Common.Interfaces.ICollection<Common.Interfaces.IActionable> {

		toggleSelect(element: Common.Interfaces.IActionable): void;
		deselectAll(): void;
        selectAll(): void;
        select(element: Common.Interfaces.IActionable): void;
        deselect(element: Common.Interfaces.IActionable): void;

    }
}