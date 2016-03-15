/// <reference path='../models.ts' />

module Playbook.Models {
	export class LineOfScrimmage extends FieldElement {

		public field: Playbook.Interfaces.IField;
		public LOS_Y_OFFSET: number;
		public y: number;
		public x: number;
		public width: number;
		public height: number;
		public color: string;
		public opacity: number;
		public data: any;

		constructor(field: Playbook.Interfaces.IField, y?: number) {
			super(field);
			this.field = field;

			if(!this.field || !this.field.ball)
				throw new Error('LineOfScrimmage constructor(): field/ball are null or undefined');

			this.LOS_Y_OFFSET = 8;
			
			this.x = 0;
			this.y = this.field.ball.y;
			this.width = this.grid.width;
			this.height = 4;

			this.color = 'yellow';
			this.opacity = 1;
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