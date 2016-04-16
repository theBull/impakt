/// <reference path='./models.ts' />

module Common.Models {

	export class Coordinates
	extends Common.Models.Modifiable {
		
		public x: number;
		public y: number;
		

		// public ax: number;
		// public ay: number;
		// public ox: number;
		// public oy: number;
		// public dx: number;
		// public dy: number;

		// x/y are grid coords
		constructor(x: number, y: number) {
			super();
			super.setContext(this);

			this.x = x;
			this.y = y;

			//this.onModified(function() { });
		}

		public toJson(): any {
			return {
				x: this.x,
				y: this.y
			}
		}

		public fromJson(json: any): any {
			if (!json)
				return;
			this.x = json.x;
			this.y = json.y;
		}

		public update(x: number, y: number) {
			this.x = x;
			this.y = y;

			//this.setModified(true);
		}
	}
	
}