/// <reference path='../models.ts' />

module Playbook.Models {
	export class Placement
	extends Common.Models.Modifiable
	implements Common.Interfaces.IModifiable {
		
		public x: number;
		public y: number;
		public index: number;

		constructor(coordinates: Playbook.Models.Coordinate, index?: number) {
			super(this);

			if(coordinates) {
				this.x = coordinates.x;
				this.y = coordinates.y;	
			}

			this.index = index >= 0 ? index : -1;
			
			this.onModified(function() {
				console.log('placement modified');
			});
		}

		public toJson(): any {
			return {
				x: this.x,
				y: this.y,
				index: this.index,
				guid: this.guid
			}
		}

		public fromJson(json: any) {
			this.x = json.x;
			this.y = json.y;
			this.index = json.index;
			this.guid = json.guid;
			this.setModified(true);
		}

		public update(x: number, y: number) {
			this.x = x;
			this.y = y;
			this.setModified(true);
		}

		public getCoordinates(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(this.x, this.y);
		}
	}
}