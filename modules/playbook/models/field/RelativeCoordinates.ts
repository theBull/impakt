/// <reference path='../models.ts' />

module Playbook.Models {

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
		public relativeElement: Playbook.Interfaces.IFieldElement;
		public distance: number;
		public theta: number;
		public rx: number;
		public ry: number;

		constructor(
			rx: number,
			ry: number,
			relativeElement?: Playbook.Interfaces.IFieldElement
		) {
			super();
			this.rx = rx;
			this.ry = ry;
			if (relativeElement) {
				this.relativeElement = relativeElement;

				this.distance = this.getDistance();
				this.theta = this.getTheta();
			}
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
			return this.relativeElement ? Playbook.Utilities.distance(
				this.rx, this.ry,
				this.relativeElement.placement.coordinates.x,
				this.relativeElement.placement.coordinates.y
			): null;	
		}
		
		public getTheta(): number {
			return this.relativeElement ? Playbook.Utilities.theta(
				this.rx, this.ry,
				this.relativeElement.placement.coordinates.x,
				this.relativeElement.placement.coordinates.y
			) : null;
		}
				
		public updateFromGridCoordinates(x: number, y: number) {
			this.rx = this.relativeElement.placement.coordinates.x - x;
			this.ry = this.relativeElement.placement.coordinates.y - y;
			
		}
		public updateFromAbsoluteCoordinates(ax: number, ay: number) {
			// snap absolute coordinates to grid coordinates first...
			let gridCoords = this.relativeElement.grid.getCoordinatesFromAbsolute(ax, ay);
			this.updateFromGridCoordinates(gridCoords.x, gridCoords.y);
		}
	}
}