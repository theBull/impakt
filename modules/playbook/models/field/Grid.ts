/// <reference path='../models.ts' />

module Playbook.Models {
	export class Grid {

		public GRIDSIZE: number;
		private GRIDBASE: number;

		public context: Playbook.Models.Canvas;
		public canvas: Playbook.Models.Canvas;
		public paper: Playbook.Models.Paper;
		public dimensions: any;
		public dashArray: Array<string>;
		public verticalStrokeOpacity: number;
		public horizontalStrokeOpacity: number;
		public strokeWidth: number;
		public width: number;
		public height: number;
		public divisor: number;

		constructor(
			context: Playbook.Models.Canvas, 
			cols: number, 
			rows: number,
			gridsize?: number
		) {
			this.context = context;
			this.canvas = this.context;
			this.paper = this.context.paper;
			this.dimensions = { cols: 0, rows: 0 };

			this.dashArray = ['- '];
			this.verticalStrokeOpacity = 0.1;
			this.horizontalStrokeOpacity = 0.3;
			this.strokeWidth = 0.5;

			this.GRIDSIZE = gridsize || 15;
			this.GRIDBASE = 10; // value must always be 10, do not change

			// TODO - want to set this to 2 to allow snapping in between grid lines
			this.divisor = 2; 


			this.width = this.paper.width;
			this.height = this.paper.height;

			this.dimensions.cols = cols;
			this.dimensions.rows = rows;
		}

		public setGridsize(gridsize: number, paper: Playbook.Models.Paper) {
			this.GRIDSIZE = gridsize;
			this.paper = paper;
			this.width = this.paper.width;
			this.height = this.paper.height;
		}

		public draw(): any {

			var cols = this.dimensions.cols;
			var rows = this.dimensions.rows;

			for(var c = 1; c < cols; c++) {
				var colX = c * this.GRIDSIZE;
				var pathStr = Playbook.Utilities.getPathString(
					colX, 
					0, 
					colX, 
					rows * this.GRIDSIZE
				);

				var p = this.paper.path(pathStr).attr({
					'stroke-dasharray': this.dashArray,
					'stroke-opacity': this.verticalStrokeOpacity,
					'stroke-width': this.strokeWidth
				});
			}
			for(var r = 1; r < rows; r++) {
				var rowY = r * this.GRIDSIZE;
				var pathStr = Playbook.Utilities.getPathString(
					0, 
					rowY, 
					this.width, 
					rowY
				);

				var opacity: any, dashes: any;
				if (r % 10 == 0) {
					if(r > 10 && r < 110) {
						let value = (r - 10);
						if (value > 50)
							value = value - ((value - 50) * 2);

						let str = value.toString();

						let lineNumbersLeft = this.paper.text(
							2,
							r,
							str,
							false
						);	
						let lineNumbersRight = this.paper.text(
							50,
							r,
							str,
							false
						);
					}
					
					opacity = 1;
					dashes = ['-'];
				} else {
					opacity = this.horizontalStrokeOpacity;
					dashes = this.dashArray;
				}

				var p = this.paper.path(pathStr).attr({
					'stroke-dasharray': dashes,
					'stroke-opacity': opacity,
					'stroke-width': this.strokeWidth
				});
			}
		}

		// returns the grid value for the bottom-most grid line (horizontal)
		public bottom(): number {
			return this.dimensions.rows;
		}

		// returns the grid value for the right-most grid line (vertical)
		public right(): number {
			return this.dimensions.cols;
		}

		public getCenter(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(
				Math.round(this.dimensions.cols / 2),
				Math.round(this.dimensions.rows / 2)
			);
		}

		public getCenterInPixels(): Playbook.Models.Coordinate {
			return this.getPixelsFromCoordinates(this.getCenter());
		}

		public getCoordinates(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(-1, -1); // TODO
		}

		public getDimensions(): any {
			return this.dimensions;
		}

		public gridProportion(): number {
			return this.GRIDSIZE / this.GRIDBASE;
		}

		public computeGridZoom(val: number): number {
			return val * this.gridProportion();
		}

		public getPixelsFromCoordinate(val: number): number {
			return val * this.GRIDSIZE;
		}

		public getPixelsFromCoordinates(coords: Playbook.Models.Coordinate)
			: Playbook.Models.Coordinate {
			let c = new Playbook.Models.Coordinate(
				this.getPixelsFromCoordinate(coords.x),
				this.getPixelsFromCoordinate(coords.y)
			);
			return c;
		}

		public getGridCoordinatesFromPixels(
			coords: Playbook.Models.Coordinate)
			: Playbook.Models.Coordinate {

			// TODO: add in paper scroll offset
			var x = Math.round((coords.x / this.GRIDSIZE) * this.divisor) / this.divisor;
			var y = Math.round((coords.y / this.GRIDSIZE) * this.divisor) / this.divisor;

			return new Playbook.Models.Coordinate(x, y);
		}

		public snapToNearest(
			coords: Playbook.Models.Coordinate)
			: Playbook.Models.Coordinate {
			return this.getGridCoordinatesFromPixels(coords);
		}

		public snap(coords: Playbook.Models.Coordinate)
			: Playbook.Models.Coordinate {
			var snapX = this.snapPixel(coords.x);
			var snapY = this.snapPixel(coords.y);
			return new Playbook.Models.Coordinate(snapX, snapY);
		}

		// takes a pixel value and translates it into a corresponding
		// number of grid units
		public snapPixel(val: number): number {
			return Math.round(
				val / (this.GRIDSIZE / this.divisor)
			) * (this.GRIDSIZE / this.divisor);
		}

		public isDivisible(val: number) {
			return val % (this.GRIDSIZE / this.divisor) == 0;
		}

		public moveToPixels(
			from: Playbook.Models.Coordinate, 
			toX: number, toY: number): Playbook.Models.Coordinate {

			return null;
		}
	}
}