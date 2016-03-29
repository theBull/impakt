/// <reference path='../models.ts' />

module Playbook.Models {
	export class FieldElement 
		extends Common.Models.Modifiable
		implements Playbook.Interfaces.IFieldElement {
		
		public context: Playbook.Interfaces.IField | 
			Playbook.Interfaces.IFieldElement |
			Playbook.Interfaces.IRoute;
		public canvas: Playbook.Interfaces.ICanvas;
		public grid: Playbook.Interfaces.IGrid;
		public field: Playbook.Interfaces.IField;
		public paper: Playbook.Interfaces.IPaper;
		public name: string;		
		public placement: Playbook.Models.Placement;
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
			context: Playbook.Interfaces.IField | 
			Playbook.Interfaces.IFieldElement |
			Playbook.Interfaces.IRoute
		) { 
			super(this);
			this.context = context;
			this.paper = this.context.paper;
			this.canvas = this.paper.canvas;
			this.field = this.paper.field;
			this.grid = this.paper.grid;

			this.placement = new Playbook.Models.Placement(0, 0, null);
			this.raphael = null;
		}

		public toJson() {
			let self = {
				guid: this.guid,
				name: this.name,
				placement: this.placement.toJson(),
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
				contextmenuTemplateUrl: this.contextmenuTemplateUrl,
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
			//console.log('getSaveData() not implemented');
		}
		public draw(...args: any[]): any {
			//console.log('draw() not implemented');
		}
		public getBBoxCoordinates(): any {
			//console.log('getBBoxCoordinates() not implemented');
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
			//console.log('hoverIn() not implemented');
		}
		public hoverOut(e: any, context?: any): void {
			//console.log('hoverOut() not implemented');
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
			var currentCoords = new Playbook.Models.Coordinates(
				this.placement.coordinates.x, 
				this.placement.coordinates.y
			);
			//console.log(this.x, this.y);
		}
		public dragStart(x: number, y: number, e: any): void {
			//console.log('dragStart() not implemented');
		}
		public dragEnd(e: any): void {
			//console.log('dragEnd() not implemented');
		}

		public drop(): void {
			
			// update placement data
			this.placement.drop();

			if (this.raphael) {
				
				let attrs;
				//console.log(this.raphael);
				if (this.raphael.type != 'circle') {

					attrs = {
						x: this.placement.coordinates.ax,
						y: this.placement.coordinates.ay
					}

				} else {
					attrs = {
						cx: this.placement.coordinates.ax,
						cy: this.placement.coordinates.ay
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

	}
}