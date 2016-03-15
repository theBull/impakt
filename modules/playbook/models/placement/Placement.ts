/// <reference path='../models.ts' />

module Playbook.Models {
	export class Placement
	extends Common.Models.Modifiable {
		
		public x: number;
		public y: number;

		constructor(options?: any) {
			super(this);
			if (!options)
				options = {};

			this.x = options.x || 25;
			this.y = options.y || 60;
		}

		public toJson(): any {
			return {
				x: this.x,
				y: this.y,
				guid: this.guid
			}
		}

		public fromJson(json: any) {
			this.x = json.x;
			this.y = json.y;
			this.guid = json.guid;
		}

		public getCoordinates(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(this.x, this.y);
		}
	}
}