/// <reference path='../models.ts' />

module Playbook.Models {

	export class Coordinates
	extends Common.Models.Storable {
		
		public x: number;
		public y: number;
		public ax: number;
		public ay: number;
		public ox: number;
		public oy: number;
		public dx: number;
		public dy: number;

		// x/y are grid coords
		constructor(x: number, y: number) {
			super();
			this.x = x;
			this.y = y;
			this.ax = 0;
			this.ay = 0;
			this.dx = 0;
			this.dy = 0;
			this.ox = this.ax;
			this.ay = this.ay;
		}

		public drop() {
			this.ax += this.dx;
			this.ay += this.dy;
			this.ox = this.ax;
			this.oy = this.ay;
			this.dx = 0;
			this.dy = 0;
		}

		public toJson(): any {
			return {
				x: this.x,
				y: this.y,
				ax: this.ax,
				ay: this.ay
			}
		}

		public fromJson(json: any): any {
			if (!json)
				return;
			this.x = json.x;
			this.y = json.y;
			this.ax = json.ax;
			this.ay = json.ay;
			this.ox = this.ax;
			this.oy = this.ay;
			this.dx = 0;
			this.dy = 0;
		}
	}
	
}