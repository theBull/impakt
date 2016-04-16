/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IDraggable {

		dragging: boolean;
		draggable: boolean;
		dragged: boolean;

		ondrag(dragStart: Function, dragMove: Function, dragEnd: Function, context: Common.Interfaces.IDraggable): void;
		dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
		dragStart(x: number, y: number, e: any): void;
		dragEnd(e: any): void;
		drop(): void;

	}

}