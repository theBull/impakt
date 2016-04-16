/// <reference path='./models.ts' />

module Common.Models {

	export class Containment {

		public left: number;
		public right: number;
		public top: number;
		public bottom: number;

		constructor(left: number, right: number, top: number, bottom: number) {
			this.left = left;
			this.right = right;
			this.top = top;
			this.bottom = bottom;
		}

		public isContained(coordinates: Common.Models.Coordinates): boolean {
			return this.isContainedX(coordinates.x) &&
				this.isContainedY(coordinates.y);
		}

		public isContainedX(x: number) {
			return x >= this.left && x <= this.right;
		}

		public isContainedY(y: number) {
			return y <= this.top && y >= this.bottom; 
		}

	}

}