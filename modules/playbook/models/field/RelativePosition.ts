/// <reference path='../models.ts' />

module Playbook.Models {

	export class RelativePosition 
	extends Playbook.Models.Coordinate {
		// gives the relative position from ElementA -> ElementB
		// uses a cartesian coordinate plane
		// ElementB acts as the origin
		// ElementA acts as a point positioned somewhere around the origin
		// ElementA above ElementB: 0, +y
		// ElementA below ElementB: 0, -y
		// ElementA left of ElementB: -x, 0
		// ElementA right of ElementB: +x, 0
		// ElementA exactly at ElementB: 0,0
		// etc...
		
		public distance: number;
		public theta: number;

		constructor(from: Playbook.Models.Player, to: Playbook.Models.FieldElement) {
			var fromCoords = new Playbook.Models.Coordinate(
				from.placement.x, 
				from.placement.y
			);
			var toCoords = new Playbook.Models.Coordinate(to.x, to.y);

			var relativeCoords = this.grid(fromCoords, toCoords);

			this.distance = Playbook.Utilities.distance(
				fromCoords.x, fromCoords.y,
				toCoords.x, toCoords.y
			);
			this.theta = Playbook.Utilities.theta(
				fromCoords.x, fromCoords.y,
				toCoords.x, toCoords.y
			);

			super(relativeCoords.x, relativeCoords.y);
		}
				
		public grid(
			from: Playbook.Models.Coordinate, 
			to: Playbook.Models.Coordinate): Playbook.Models.Coordinate {
			// returns values as grid units
			return new Playbook.Models.Coordinate(from.x - to.x, to.y - from.y);
		}
		public absolute(): Playbook.Models.Coordinate {
			// returns values as absolute pixels
			// 
			return null;
		}
		public window(): Playbook.Models.Coordinate {
			// returns pixel position relative to the window in pixels
			return null;
		}
	}
}