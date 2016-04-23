/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IFieldElement
	extends Common.Interfaces.IModifiable {

		field: Common.Interfaces.IField;
		ball: Common.Interfaces.IBall;
		relativeElement: Common.Interfaces.IFieldElement;
		paper: Common.Interfaces.IPaper;
		grid: Common.Interfaces.IGrid;
		layer: Common.Models.Layer;
		contextmenuTemplateUrl: string;

		draw(): void;
        hoverIn(e: any): void;
        hoverOut(e: any): void;
        click(e: any): void;
        mousedown(e: any): void;
        mousemove(e: any): void;
		contextmenu(e: any): void;
		dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void;
		dragStart(x: number, y: number, e: any): void;
		dragEnd(e: any): void;
		drop(): void;
		getGraphics(): Common.Models.Graphics;
		getLayer(): Common.Models.Layer;
		
	}
}