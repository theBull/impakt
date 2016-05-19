/// <reference path='./models.ts' />

module Common.Models {

	export class RelativeCoordinates 
		extends Common.Models.Storable {

		// gives the relative position fromPlacement -> toPlacement
		// uses a cartesian coordinate plane
		// toPlacement acts as the origin
		// fromPlacement acts as a point positioned somewhere around the origin
		// fromPlacement above ElementB: 0, +y
		// fromPlacement below ElementB: 0, -y
		// fromPlacement left of ElementB: -x, 0
		// fromPlacement right of ElementB: +x, 0
		// fromPlacement exactly at ElementB: 0,0
		// etc...
		public relativeElement: Common.Interfaces.IFieldElement;
		public distance: number;
		public theta: number;
		public rx: number;
		public ry: number;

		constructor(
			rx: number,
			ry: number,
			relativeElement?: Common.Interfaces.IFieldElement
		) {
			super();
			this.rx = rx;
			this.ry = ry;
			if (relativeElement) {
				this.relativeElement = relativeElement;

				this.distance = this.getDistance();
				this.theta = this.getTheta();
			} else {
				this.relativeElement = null;
				this.distance = 0;
				this.theta = 0;
			}
		}

		public drop(): void {

		}

		public toJson(): any {
			return {
				rx: this.rx,
				ry: this.ry
			}
		}

		public fromJson(json: any): any {
			if (!json)
				return;
			
			this.rx = json.rx;
			this.ry = json.ry;
		}

		public getDistance(): number {
			if (Common.Utilities.isNullOrUndefined(this.relativeElement))
				return null;

			return this.relativeElement ? Common.Drawing.Utilities.distance(
				this.rx, this.ry,
				this.relativeElement.graphics.placement.coordinates.x,
				this.relativeElement.graphics.placement.coordinates.y
			): null;	
		}
		
		public getTheta(): number {
			if (Common.Utilities.isNullOrUndefined(this.relativeElement))
				return null;

			return this.relativeElement ? Common.Drawing.Utilities.theta(
				this.rx, this.ry,
				this.relativeElement.graphics.placement.coordinates.x,
				this.relativeElement.graphics.placement.coordinates.y
			) : null;
		}
				
		public updateFromGridCoordinates(x: number, y: number) {
			if (Common.Utilities.isNullOrUndefined(this.relativeElement))
				return;

			this.rx = x - this.relativeElement.graphics.placement.coordinates.x;
			this.ry = this.relativeElement.graphics.placement.coordinates.y - y;			
		}
		public updateFromAbsoluteCoordinates(ax: number, ay: number) {
			// snap absolute coordinates to grid coordinates first...
			let gridCoords = this.relativeElement.grid.getCoordinatesFromAbsolute(ax, ay);
			this.updateFromGridCoordinates(gridCoords.x, gridCoords.y);
		}

		/**
		 * Takes a set of relative x,y coordinates and returns the exact grid
		 * coordinates; assumes the rx/ry values passed in are value grid coordinates
		 * 
		 * @param  {number}                    rx relative x (grid coordinate)
		 * @param  {number}                    ry relative y (grid coordinate)
		 * @return {Common.Models.Coordinates}    The calculated coordinate
		 */
		public getCoordinatesFromRelative(rx: number, ry: number): Common.Models.Coordinates {
			if (Common.Utilities.isNullOrUndefined(this.relativeElement))
				return null;

			return new Common.Models.Coordinates(
				this.relativeElement.graphics.placement.coordinates.x + rx,
				this.relativeElement.graphics.placement.coordinates.y - ry
			);
		}

		public getCoordinates(): Common.Models.Coordinates {
			let self = this;
			return new Common.Models.Coordinates(
				this.relativeElement.graphics.placement.coordinates.x + self.rx,
				this.relativeElement.graphics.placement.coordinates.y - self.ry
			);
		}
	}
}