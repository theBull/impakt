/// <reference path='../models.ts' />

module Playbook.Models {
	export class Placement
	extends Common.Models.Modifiable
	implements Common.Interfaces.IModifiable {
		
		public relative: Playbook.Models.RelativeCoordinates;
		public coordinates: Playbook.Models.Coordinates;
		public relativeElement: Playbook.Interfaces.IFieldElement;
		public grid: Playbook.Interfaces.IGrid;
		public index: number;

		constructor(
			rx: number, 
			ry: number, 
			relativeElement: Playbook.Interfaces.IFieldElement, 
			index?: number
		) {
			super(this);
			if (!relativeElement)
			    throw new Error('Placement constructor(): relativeElement is null or undefined');

			this.relativeElement = relativeElement;
			this.grid = this.relativeElement.grid;
			this.relative = new Playbook.Models.RelativeCoordinates(rx, ry, this.relativeElement);
			this.index = index >= 0 ? index : -1;
			this.onModified(function() {
				console.log('TODO @theBull - placement modified callback');
			});
		}
		public toJson(): any {
			return {
				relativeCoordinates: this.relative.toJson(),
				coordinates: this.coordinates.toJson(),
				index: this.index,
				guid: this.guid
			};
		}
		public fromJson(json: any): any {
			this.relative.fromJson(json.relativeCoordinates);
			this.coordinates.fromJson(json.coordinates);
			this.index = json.index;
			this.guid = json.guid;
			this.setModified(true);
		}
		public moveByDelta(dx: number, dy: number) {
			if (!this.coordinates)
				throw new Error('Placement moveByDelta(): coordinates are null or undefined');

			this.coordinates.dx = dx;
			this.coordinates.dy = dy;
			this.coordinates.ax = this.coordinates.ox + this.coordinates.dx;
			this.coordinates.ay = this.coordinates.oy + this.coordinates.dy;
		}
		public drop() {
			this.coordinates.drop();
		}
		public refresh() {
			var absCoords = this.grid.getAbsoluteFromCoordinates(
				this.coordinates.x, 
				this.coordinates.y
			);
			this.coordinates.ax = absCoords.x;
			this.coordinates.ay = absCoords.y;
			this.coordinates.ox = this.coordinates.ax;
			this.coordinates.oy = this.coordinates.ay;
		}
		/**
		 * Updates this placement with the given placement
		 *
		 * @param {number} placement The new placement
		 */
		public update(placement: Playbook.Models.Placement) {
			// Update this' values
			this.fromJson(placement.toJson());
		}
		public updateCoordinatesFromAbsolute(ax: number, ay: number) {
			this.coordinates.ax = ax;
			this.coordinates.ay = ay;
			var absCoords = this.grid.getCoordinatesFromAbsolute(ax, ay);
			this.coordinates.x = absCoords.x;
			this.coordinates.y = absCoords.y;
			// update relative coordinates
			this.relative.updateFromGridCoordinates(
				this.coordinates.x, 
				this.coordinates.y
			);
		}
		public updateCoordinates(x: number, y: number) {
		}
	}
}