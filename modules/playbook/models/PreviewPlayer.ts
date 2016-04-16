/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayer 
	extends Common.Models.Player
	implements Common.Interfaces.IPlayer,
	Common.Interfaces.IPlaceable,
	Common.Interfaces.ILayerable {

		constructor(
			context: Common.Interfaces.IField,
			placement: Common.Models.Placement,
			position: Team.Models.Position,
			assignment: Common.Models.Assignment
		) {
			super(context, placement, position, assignment);

			// the set acts as a group for the other graphical elements
			this.icon = new Playbook.Models.PreviewPlayerIcon(this);
		}

		public draw() {
			this.icon.draw();
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
	}
}