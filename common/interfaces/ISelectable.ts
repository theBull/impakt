/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface ISelectable
	extends Common.Interfaces.IStorable {

		disabled: boolean;
		clickable: boolean;
		hoverable: boolean;
		selected: boolean;
		selectedFill: string;
		selectedStroke: string;
		selectedOpacity: number;
		selectable: boolean;

		select(): void;
		deselect(): void;
		toggleSelect(): void;
		disable(): void;
		enable(): void;

		onhover(hoverIn: any, hoverOut: any, context: any): void;
		hoverIn(e: any, context?: any): void;
		hoverOut(e: any, context?: any): void;
		onclick(fn: any, context: any): void;
		click(e: any, context: any): void;
		onmousedown(fn: any, context: any): void;
		onmouseup(fn: any, context: any): void;
		mousedown(e: any, context: any): void;
		oncontextmenu(fn: any, context: any): void;
		contextmenu(e: any, context: any): void;
	}

}