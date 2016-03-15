/// <reference path='../models.ts' />
module Playbook.Models {
	
	export class Ball 
	extends Playbook.Models.FieldElement {

		public offset: number;

		constructor(context: Playbook.Interfaces.IField) {
			super(context);

			this.color = 'brown';
			this.x = 26;
			this.y = 60;
			var absCoords = this.grid.getPixelsFromCoordinates(
				new Playbook.Models.Coordinate(this.x, this.y)
			);
			this.ax = absCoords.x;
			this.ay = absCoords.y;

			this.bx = 0;
			this.by = 0;

			this.width = this.grid.getSize() * 0.15;
			this.height = this.grid.getSize() * 0.25;
			this.offset = this.grid.getCenter().x;
		}

		public draw(): any {
			console.log('drawing football...');
			this.raphael = this.paper.ellipse(
				this.x,
				this.y,
				this.width,
				this.height
			).attr({
				'fill': this.color
			});

			super.click(this.click, this);
			super.mousedown(this.mousedown, this);

			this.drag(
				this.dragMove, 
				this.dragStart, 
				this.dragEnd, 
				this, 
				this, 
				this
			);

			// constrain x/y directions
			// move LOS and all players with ball
		}

		public click(e: any, self: any) {
			console.log('Ball at (', self.x, self.y, ')');
		}

		public mousedown(e: any, self: any) {
			console.log('football mousedown');
		}

		public dragMove(dx: number, dy: number, posx: number, posy: number, e: any) {
			console.log('football drag not implemented');
		}

		public dragStart(x: number, y: number, e: any) {
			console.log('footabll drag (start) not implemented');
		}

		public dragEnd(e: any) {
			console.log('football drag (end) not implemented');
		}

		public getGridCoordinates(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(this.x, this.y);
		}

		// coords is a grid-based number (not an absolute pixel value),
		// returns absolute x/y coordinates as pixel values
		public getRelativeCoordinatesInPixels(
			coords: Playbook.Models.Coordinate): any {
			var ballCoords = new Playbook.Models.Coordinate(this.x, this.y);

			var itemX: number, itemY: number;
			if(coords.x && coords.y) {
				var itemDistance = this.grid.getPixelsFromCoordinates(coords);
				itemX = ballCoords.x + itemDistance.x;
				itemY = ballCoords.y - itemDistance.y;		
			} else if(!coords.x && coords.y) {
				itemX = ballCoords.x;

				// convert y coord argument into pixel-based coords (from grid-based)
				var itemYDistance = this.grid.getPixelsFromCoordinate(coords.y);
				itemY = ballCoords.y - itemDistance.y;

			} else if(coords.x && !coords.y) {
				itemY = ballCoords.y;

				// convert x coord argument into pixel-based coords (from grid-based)
				var itemXDistance = this.grid.getPixelsFromCoordinate(coords.x);
				itemX = ballCoords.x + itemDistance.x;
			} else {
				itemX = ballCoords.x;
				itemY = ballCoords.y;
			}
			
			return new Playbook.Models.Coordinate(itemX, itemY);
		}

		public isWhichSideOf(coords: Playbook.Models.Coordinate): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(
				this.isLeftOf(coords.x) ? -1 : 1,
				this.isAbove(coords.y) ? 1 : -1
			);
		}

		public isLeftOf(x: number): boolean {
			return this.x > x;
		}

		public isRightOf(x: number): boolean {
			return this.x <= x;
		}

		public isAbove(y: number): boolean {
			return this.y > y;
		}

		public isBelow(y: number): boolean {
			return this.y <= y;
		}
	}
}