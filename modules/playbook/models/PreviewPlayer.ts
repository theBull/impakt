/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayer 
	extends Common.Models.Player
	implements Common.Interfaces.IPlayer,
	Common.Interfaces.IPlaceable,
	Common.Interfaces.ILayerable {

		constructor(
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		) {
			super(placement, position, assignment);
		}

		public initialize(field: Common.Interfaces.IField): void {
			super.initialize(field);
			
			// the set acts as a group for the other graphical elements
			this.icon = new Playbook.Models.PreviewPlayerIcon(this);
			this.personnelLabel = new Playbook.Models.PreviewPlayerPersonnelLabel(this);
			this.renderType = Common.Enums.RenderTypes.Preview;
			this.layer.addLayer(this.icon.layer);

			// parse route json data
			if (Common.Utilities.isNotNullOrUndefined(this.assignment)) {
				this.assignment.setRoutes(this, Common.Enums.RenderTypes.Preview);
			}
		}

		public draw() {
			this.icon.draw();
			//this.personnelLabel.draw();

			if (Common.Utilities.isNotNullOrUndefined(this.assignment)) {
				this.assignment.draw();
			}
		}

		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any): void {
			// Not implemented - preview player does not have drag functionality
		}
		public dragStart(x: number, y: number, e: any): void {
			// Not implemented - preview player does not have drag functionality
		}
		public dragEnd(e: any): void {
			// Not implemented - preview player does not have drag functionality
		}

		public setAssignment(assignment: Common.Models.Assignment): void {
			super.setAssignment(assignment);

			if(Common.Utilities.isNotNullOrUndefined(assignment))
				this.assignment.setRoutes(this, Common.Enums.RenderTypes.Preview);

			this.setModified(true);
		}
	}
}