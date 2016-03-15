/// <reference path='../models.ts' />

module Playbook.Models {
	export class Sideline extends FieldElement {

		public context: Playbook.Models.Field;
		public canvas: Playbook.Models.Canvas;
		public paper: Playbook.Models.Paper;
		public color: string;
		public opacity: number;
		public width: number;
		public height: number;
		public x: number;
		public y: number;
		public offset: number;

		constructor(context: Playbook.Models.Field, offset?: number) {
			super(context);

			this.context = context;
			this.canvas = this.context.canvas;
			this.paper = this.context.paper;
			this.color = '#111111'; //offset ? (offset < 0 ? 'red' : 'green'): 'black';

			this.opacity = 1;

			this.x = this.grid.getCenter().x;
			this.y = 0;
			this.width = this.grid.GRIDSIZE;
			this.height = this.paper.height;
			this.offset = offset || 0;
		}

		public draw(): void {
			// adjust the left sideline so that it does not overlap the grid
			// by shifting it left by its width so that its right edge aligns
			// with the gridline
			var bumpX = this.offset < 0 ? -this.width : 0;

			var rect = this.paper.rect(
				this.x + this.offset,
				this.y,
				this.width,
				this.height
			).attr({
				'fill': this.color,
				'fill-opacity': this.opacity,
				'stroke-width': 0
			});

			this.paper.bump(bumpX, 0, rect);
		}
	}
}

	