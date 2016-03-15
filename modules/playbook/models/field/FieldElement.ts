/// <reference path='../models.ts' />

module Playbook.Models {
	export class FieldElement 
		extends Common.Models.Modifiable
		implements Playbook.Interfaces.IFieldContext {
		
		public context: any;
		public canvas: Playbook.Models.Canvas;
		public field: Playbook.Models.Field;
		public paper: Playbook.Models.Paper;
		public grid: Playbook.Models.Grid;
		public ball: Playbook.Models.Ball;
		public id: number;
		public guid: string;
		public name: string;
		public position: Playbook.Models.Position;
		public coords: Playbook.Models.Coordinate;
		public x: number; // x grid coordinate
		public y: number; // y grid coordinate
		public ax: number; // x absolute pixel value relative to paper
		public ay: number; // y absolute pixel value relative to paper
		public bx: number; // x coord relative to ball
		public by: number; // y coord relative to ball
		public cx: number; // x coord for circle
		public cy: number; // y coord for circle
		public dx: number; // x abs. delta for dragging
		public dy: number; // y abs. delta for dragging

		// ox/oy - can be used to store the original item position before
		// dragging to determine exact pixels of the item for each drag
		public ox: number; // x abs. original position for dragging
		public oy: number; // y abs. original position for dragging
		public radius: number;
		public transformString: string;
		public width: number;
		public height: number;
		public raphael: any;
		public positionAbsolutely: boolean;
		public selected: boolean;
		public disabled: boolean;
		public dragging: boolean;
		public draggable: boolean;
		public dragged: boolean;
		public clickable: boolean;
		public hoverable: boolean;
		public opacity: number;
		public color: string;
		public contextmenuTemplateUrl: string;

		constructor(
			context: Playbook.Interfaces.IFieldContext, 
			canvas?: Playbook.Models.Canvas
		) { 
			super(this);
			this.context = context;
			this.canvas = canvas || this.context.canvas;
			this.field = this.context.field;
			this.paper = this.context.paper;
			this.grid = this.context.grid;
			this.raphael = null;
			this.dx = 0;
			this.dy = 0;

			// guid set by parent (Modifiable)
		}

		public toJson() {
			let self = {
				//id: this.id, // TODO: deprecate?
				guid: this.guid,
				name: this.name,
				//coords: this.coords, // TODO: deprecate?
				x: this.x,
				y: this.y,
				ax: this.ax,
				ay: this.ay,
				bx: this.bx,
				by: this.by,
				cx: this.cx,
				cy: this.cy,
				dx: this.dx,
				dy: this.dy,
				ox: this.ox,
				oy: this.oy,
				radius: this.radius,
				transformString: this.transformString, // TODO: deprecate?
				width: this.width,
				height: this.height,
				positionAbsolutely: this.positionAbsolutely,
				selected: this.selected,
				disabled: this.disabled,
				dragging: this.dragging,
				draggable: this.draggable,
				dragged: this.dragged,
				clickable: this.clickable,
				hoverable: this.hoverable,
				opacity: this.opacity,
				color: this.color,
				contextmenuTemplateUrl: this.contextmenuTemplateUrl
			}
			return Common.Utilities.toJson(self);
		}

		public fromJson(json: any) {

		}

		public disable() {

		}

		public select() {

		}

		public show(): any {
			return this.raphael.show();
		}

		public hide(): any {
			return this.raphael.hide();
		}

		public glow(): any {
			return this.raphael.glow();
		}

		public getSaveData(): any {
			console.log('getSaveData() not implemented');
		}
		public draw(...args: any[]): any {
			console.log('draw() not implemented');
		}
		public getBBoxCoordinates(): any {
			console.log('getBBoxCoordinates() not implemented');
		}
		public mouseDown(fn: any, context: any): void {
			this.raphael.mousedown(function(e: any) {
				fn(e, context);
			});
		}
		public hover(hoverIn: any, hoverOut: any, context: any): void {
			this.raphael.hover(
				function(e: any) {
					hoverIn(e, context);
				},
				function(e: any) {
					hoverOut(e, context);
				}
			)
		}
		public hoverIn(e: any, context?: any): void {
			console.log('hoverIn() not implemented');
		}
		public hoverOut(e: any, context?: any): void {
			console.log('hoverOut() not implemented');
		}
		public click(fn: any, context: any): void {
			//console.log('fieldElement click');
			this.raphael.click(function(e: any) {
				fn(e, context);
			});
		}
		public mousedown(fn: any, context: any): void {
			// console.log('inherited mousedown');
			this.raphael.mousedown(function(e: any) {
				fn(e, context);
			})
		}
		public contextmenu(fn: any, context: any): void {
			this.raphael.mousedown(function(e: any) {
				if(e.which == 3) {
					fn(e, context);
				}
			});
		}
		public drag(dragMove: any, dragStart: any, dragEnd: any,
			dragMoveContext: any, dragStartContext: any, dragEndContext: any): void {
			this.raphael.drag(
				dragMove, dragStart, dragEnd,
				dragMoveContext, dragStartContext, dragEndContext
			);
		}
		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
			var currentCoords = new Playbook.Models.Coordinate(this.x, this.y);
			console.log(this.x, this.y);
		}
		public dragStart(x: number, y: number, e: any): void {
			console.log('dragStart() not implemented');
		}
		public dragEnd(e: any): void {
			console.log('dragEnd() not implemented');
		}

		public drop(): void {
			console.log('drop element: ', this.ax, this.ay, this.dx, this.dy);
			this.ax += this.dx;
			this.ay += this.dy;
			this.ox = this.ax;
			this.oy = this.ay;
			this.cx = this.ax;
			this.cy = this.ay;
			this.dx = 0;
			this.dy = 0;
			if (this.raphael) {
				
				let coords = new Playbook.Models.Coordinate(this.ax, this.ay);
				this.setCoordinates();

				let attrs;
				console.log(this.raphael);
				if (this.raphael.type != 'circle') {

					attrs = {
						x: this.ax,
						y: this.ay
					}

				} else {
					attrs = {
						cx: this.ax,
						cy: this.ay
					};
				}

				this.raphael.attr(attrs);
			}
		}

		// drawing
		public setFillOpacity(opacity: number): FieldElement {
			return this.raphael.attr({ 'fill-opacity': opacity });
		}
		public setStrokeColor(color: string): FieldElement {
			return this.raphael.attr({ 'stroke': color });
		}
		public setFillColor(color: string): FieldElement {
			return this.raphael.attr({ 'fill': color });
		}

		// Coordinates
		public setCoordinates() {
			this.x; // x grid coordinate
			this.y; // y grid coordinate
			this.ax; // x absolute pixel value relative to paper
			this.ay; // y absolute pixel value relative to paper
			this.bx; // x coord relative to ball
			this.by; // y coord relative to ball
			this.cx; // x coord for circle
			this.cy; // y coord for circle
			this.dx; // x abs. delta for dragging
			this.dy; // y abs. delta for dragging
		}

	}
}