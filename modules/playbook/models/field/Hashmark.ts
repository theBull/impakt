/// <reference path='../models.ts' />

module Playbook.Models {
	export class Hashmark extends FieldElement {

		public offset: number;

		constructor(context: Playbook.Models.Field, offset?: number) {
			super(context);

			// hash marks should be -x- grid units from center
			this.offset = offset || 3;

			this.x = this.grid.getCenter().x + this.offset;
			this.y = 0;
			this.width = (this.grid.GRIDSIZE / 2);
			this.height = 1;

			this.opacity = 0.9;
			this.color = 'black';

		}
		
		public draw(): void {

			for (var i = 11; i < 110; i++) {
				this.raphael = this.paper.rect(
					this.x,
					i,
					this.width,
					this.height
				).attr({
					'fill': this.color,
					'fill-opacity': this.opacity,
					'stroke-width': 0
				});

				this.paper.bump(-(this.width / 2), 0, this.raphael);
			}
		}
	}	
}