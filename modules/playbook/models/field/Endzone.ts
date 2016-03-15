/// <reference path='../models.ts' />

module Playbook.Models {
	export class Endzone extends FieldElement {

		public context: Playbook.Models.Field;
		public canvas: Playbook.Models.Canvas;
		public paper: Playbook.Models.Paper;
		public color: string;
		public opacity: number;
		public width: number;
		public height: number;
		public x: number;
		public y: number;

		constructor(context: Playbook.Models.Field, gridOffset?: number) {
			super(context);

			this.context = context;
			this.canvas = this.context.canvas;
			this.paper = this.context.paper;
			this.grid = this.context.grid;
			this.color = 'black';

			this.opacity = 0.25;

			this.x = 1;
			this.y = gridOffset || 0;
			this.width = this.paper.width - (2 * this.grid.GRIDSIZE);
			this.height = 10 * this.grid.GRIDSIZE;
		}

		public draw(): void {

			var rect = this.paper.rect(
				this.x,
				this.y,
				this.width,
				this.height
			).attr({
				'fill': this.color,
				'fill-opacity': this.opacity
			});
		}
	}
}

	