/// <reference path='./models.ts' />

module Common.Models {
	export class Location
	extends Common.Models.Modifiable {
		
		public ax: number;
		public ay: number;
		public ox: number;
		public oy: number;
		public dx: number;
		public dy: number;

		constructor(ax: number, ay: number) {
			super();
			super.setContext(this);

			this.ax = ax;
			this.ay = ay;
			this.ox = this.ax;
			this.oy = this.ay;
			this.dx = 0;
			this.dy = 0;

			//this.onModified(function() { });
		}

		public toJson(): any {
			return {
				ax: this.ax,
				ay: this.ay,
				ox: this.ox,
				oy: this.oy,
				dx: this.dx,
				dy: this.dy
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.ax = json.ax;
			this.ay = json.ay;
			this.ox = json.ox;
			this.oy = json.oy;
			this.dx = json.dx;
			this.dy = json.dy;
		}

		public drop() {
			this.ox = this.ax;
			this.oy = this.ay;
			this.dx = 0;
			this.dy = 0;
		}

		public moveByDelta(dx: number, dy: number): void {
			this.dx = dx;
            this.dy = dy;
            this.ax = this.ox + this.dx;
            this.ay = this.oy + this.dy;

            //this.setModified(true);
		}

		public updateFromAbsolute(ax?: number, ay?: number) {
			this.ax = Common.Utilities.isNullOrUndefined(ax) ? this.ax : ax;
			this.ay = Common.Utilities.isNullOrUndefined(ay) ? this.ay : ay;
            this.dx = 0;
            this.dy = 0;
            this.ox = this.ax;
            this.oy = this.ay;

            //this.setModified(true);
		}

		public hasChanged(): boolean {
			return Math.abs(this.dx) > 0 || Math.abs(this.dy) > 0;
		}
	}
}