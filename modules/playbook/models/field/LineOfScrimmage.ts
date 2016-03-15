/// <reference path='../models.ts' />

module Playbook.Models {
	export class LineOfScrimmage extends FieldElement {

		public context: Playbook.Models.Field;
		public canvas: Playbook.Models.Canvas;
		public paper: Playbook.Models.Paper;
		public LOS_Y_OFFSET: number;
		public y: number;
		public x: number;
		public width: number;
		public height: number;
		public color: string;
		public opacity: number;
		public data: any;

		constructor(context: Playbook.Models.Field, y?: number) {
			super(context);

			this.context = context;
			this.canvas = this.context.canvas;
			this.paper = this.context.paper;
			this.grid = this.canvas.grid;
			this.LOS_Y_OFFSET = 8;
			
			this.x = 1;
			this.y = this.grid.getCenter().y;
			this.width = this.paper.width - (2 * this.grid.GRIDSIZE);
			this.height = 4;

			this.color = 'blue';
			this.opacity = 0.25;
		}

		public draw(): void {

			this.paper.rect(
				this.x, 
				this.y, 
				this.width,
				this.height
			).click(this.click).attr({
				'fill': this.color,
				'fill-opacity': this.opacity,
				'stroke-width': 0
			});

			// todo: attach drag functionality
			// drag when moving ball
		}

		public getSaveData(): any {
			return this.y;
		}

	}
}