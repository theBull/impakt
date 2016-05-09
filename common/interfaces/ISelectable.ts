/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface ISelectable
	extends Common.Interfaces.IStorable,
	Common.Interfaces.IActionable {

		selectedFill: string;
		selectedStroke: string;
		selectedOpacity: number;

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