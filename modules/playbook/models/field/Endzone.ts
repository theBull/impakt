/// <reference path='../models.ts' />

module Playbook.Models {
	export class Endzone extends FieldElement {

		public context: Playbook.Interfaces.IField;

		constructor(
			context: Playbook.Interfaces.IField, 
			gridOffset?: number
		) {
			super(context);

			this.context = context;
			this.color = 'black';

			this.opacity = 0.25;

			this.x = 1;
			this.y = gridOffset || 0;
			this.width = this.paper.getWidth() - 
				(2 * this.grid.getSize());
			this.height = 10 * this.grid.getSize();
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

	