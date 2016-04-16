/// <reference path='./models.ts' />

module Common.Models {
	export class Placement
		extends Common.Models.Modifiable
		implements Common.Interfaces.IModifiable {

		public grid: Common.Interfaces.IGrid;
		public relative: Common.Models.RelativeCoordinates;
		public coordinates: Common.Models.Coordinates;
		public relativeElement: Common.Interfaces.IFieldElement;
		public index: number;

		constructor(
			rx: number,
			ry: number,
			relativeElement?: Common.Interfaces.IFieldElement,
			index?: number
		) {
			super();
			super.setContext(this);

			if (!relativeElement) {
				this.coordinates = new Common.Models.Coordinates(rx, ry);
				this.relative = new Common.Models.RelativeCoordinates(0, 0, null);
			} else {
				this.relativeElement = relativeElement;
				this.grid = this.relativeElement.grid;
				this.relative = new Common.Models.RelativeCoordinates(rx, ry, this.relativeElement);
				this.coordinates = this.relative.getCoordinates();
			}

			this.index = index >= 0 ? index : -1;
			
			//this.onModified(function() {});
		}

		public toJson(): any {
			return {
				relative: this.relative.toJson(),
				coordinates: this.coordinates.toJson(),
				index: this.index,
				guid: this.guid
			};
		}

		public fromJson(json: any): any {
			this.relative.fromJson(json.relative);
			this.coordinates.fromJson(json.coordinates);
			this.index = json.index;
			this.guid = json.guid;
			//this.setModified(true);
		}

		public updateFromCoordinates(x: number, y: number) {
			this.coordinates.update(x, y);
			this.relative.updateFromGridCoordinates(
				this.coordinates.x,
				this.coordinates.y
			);
			//this.setModified(true);
		}
	}
}