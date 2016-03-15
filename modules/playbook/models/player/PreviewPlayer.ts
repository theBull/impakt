/// <reference path='../models.ts' />

module Playbook.Models {

	// @todo treat Player as a FieldElementSet
	export class PreviewPlayer 
	extends Playbook.Models.Player {

		constructor(
			context: Playbook.Models.Field,
			placement: Playbook.Models.Placement,
			position: Playbook.Models.Position,
			assignment: Playbook.Models.Assignment
		) {
			super(context, placement, position, assignment);
			this.color = '#000000';
			this.opacity = 1;

			// the set acts as a group for the other graphical elements
			this.icon = new FieldElement(this);
		}

		public draw() {

			this.paper.remove(this.icon.raphael);
			this.icon.raphael = this.paper.circle(
				this.placement.x,
				this.placement.y - 40,
				this.radius
			).attr({
				'fill': this.color,
				'stroke-width': 0,
			});
			this.icon.x = this.icon.raphael.attr('x');
			this.icon.y = this.icon.raphael.attr('y');
			this.icon.radius = this.radius;
			this.icon.ax = this.icon.x + this.radius;
			this.icon.ay = this.icon.y + this.radius;
			this.icon.width = this.radius * 2;
			this.icon.height = this.radius * 2;


			// if(this.assignment){
			// 	let route = this.assignment.routes.getOne();
			// 	// TODO: implement route switching
			// 	if (route) {
			// 		route.draw();
			// 	}	
			// }
		}
	}
}