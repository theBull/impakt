/// <reference path='./models.ts' />

module Common.Models {
	export class Placement
		extends Common.Models.Modifiable
		implements Common.Interfaces.IModifiable {

		public grid: Common.Interfaces.IGrid;
		public relative: Common.Models.RelativeCoordinates;
		public coordinates: Common.Models.Coordinates;
		public relativeElement: Common.Interfaces.IFieldElement;
		public flipped: boolean;
		public index: number;

		constructor(
			rx: number,
			ry: number,
			relativeElement?: Common.Interfaces.IFieldElement,
			index?: number
		) {
			super();
			super.setContext(this);

			this.updateFromRelative(rx, ry, relativeElement);
			this.flipped = false;
			this.index = index >= 0 ? index : -1;
			
			//this.onModified(function() {});
		}

		public copy(newPlacement?: Common.Models.Placement): Common.Models.Placement {
			let copyPlacement = newPlacement || new Common.Models.Placement(this.relative.rx, this.relative.ry, this.relativeElement);
			return <Common.Models.Placement>super.copy(copyPlacement, this);
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
		}

		public setRelativeElement(relativeElement: Common.Interfaces.IFieldElement): void {
			if (Common.Utilities.isNotNullOrUndefined(relativeElement)) {
				this.relative.relativeElement = relativeElement;
				this.relativeElement = relativeElement;
				this.grid = this.relativeElement.grid;
			}
		}

		public update(placement: Common.Models.Placement): void {
			if (Common.Utilities.isNullOrUndefined(placement))
				return;
			
			this.setRelativeElement(placement.relativeElement);
			this.fromJson(placement.toJson());
		}

		public updateFromAbsolute(ax: number, ay: number): void {
			let coords = this.grid.getCoordinatesFromAbsolute(ax, ay);
			this.relative.updateFromGridCoordinates(coords.x, coords.y);
			this.coordinates.update(coords.x, coords.y);
		}

		public updateFromCoordinates(x: number, y: number): void {
			this.coordinates.update(x, y);
			this.relative.updateFromGridCoordinates(
				this.coordinates.x,
				this.coordinates.y
			);
		}

		public updateFromRelative(rx: number, ry: number, relativeElement?: Common.Interfaces.IFieldElement): void {
			if (!relativeElement) {
				this.coordinates = new Common.Models.Coordinates(rx, ry);
				this.relative = new Common.Models.RelativeCoordinates(0, 0, null);
				this.relativeElement = null;
				this.grid = null;				
			} else {
				this.relativeElement = relativeElement;
				this.grid = this.relativeElement.grid;
				this.relative = new Common.Models.RelativeCoordinates(rx, ry, this.relativeElement);
				this.coordinates = this.relative.getCoordinates();
			}
		}

		public flip(): void {
			this.updateFromRelative(
				this.relative.rx * -1, 
				this.relative.ry * -1, 
				this.relativeElement
			);
			this.flipped = !this.flipped;
		}
	}
}