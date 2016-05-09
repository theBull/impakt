/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IDraggable
	extends Common.Interfaces.IActionable {

		dragging: boolean;
		dragged: boolean;

		ondrag(
			dragStart: Function, 
			dragMove: Function, 
			dragEnd: Function, 
			context: Common.Interfaces.IFieldElement
		): void;
		dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
		dragStart(x: number, y: number, e: any): void;
		dragEnd(e: any): void;
		drop(): void;

	}

}