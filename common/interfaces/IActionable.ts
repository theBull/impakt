/// <reference path='./interfaces.ts' />

module Common.Interfaces {

	export interface IActionable
		extends Common.Interfaces.IModifiable {

		impaktDataType: Common.Enums.ImpaktDataTypes;
		graphics: Common.Models.Graphics;
		disabled: boolean;
		clickable: boolean;
		hoverable: boolean;
		hovered: boolean;
		selected: boolean;
		selectable: boolean;
		draggable: boolean;
		dragging: boolean;
		flipped: boolean;
		flippable: boolean;
		visible: boolean;
		contextmenuTemplateUrl: string;
		actions: Common.Models.ActionRegistry;

		hasGraphics(): boolean;
		toggleOpacity(): void;
		isSelectable(): boolean;
		select(): void;
		deselect(): void;
		toggleSelect(metaKey?: boolean): void;
		disable(): void;
		enable(): void;
		show(): void;
		hide(): void;
		toggleVisibility(): void;
		getContextmenuUrl(): string;
		drop(): void;
		onhover(hoverIn: any, hoverOut: any, context: Common.Interfaces.IActionable): void;
		hoverIn(e: any): void;
		hoverOut(e: any): void;
		onclick(fn: any, context: Common.Interfaces.IActionable): void;
		click(e: any): void;
		oncontextmenu(fn: any, context: Common.Interfaces.IActionable): void;
		contextmenu(e: any): void;
		onmousedown(fn: any, context: Common.Interfaces.IActionable): void;
		onmouseup(fn: any, context: Common.Interfaces.IActionable): void;
		mousedown(e: any): void;
		onmousemove(fn: any, context: Common.Interfaces.IActionable): void;
		mousemove(e: any): void;
		ondrag(dragMove: Function, dragStart: Function, dragEnd: Function, context: Common.Interfaces.IActionable): void;


	}
}

