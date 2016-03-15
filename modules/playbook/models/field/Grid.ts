/// <reference path='../models.ts' />

module Playbook.Models {
	export class Grid
	implements Playbook.Interfaces.IGrid {

		public paper: Playbook.Interfaces.IPaper;
		public cols: number;
		public rows: number;
		public width: number;
		public height: number;
		public divisor: number;
		public size: number;
		public dashArray: Array<string>;
		public verticalStrokeOpacity: number;
		public horizontalStrokeOpacity: number;
		public color: string;
		public strokeWidth: number;
		protected base: number;

		constructor(
			paper: Playbook.Interfaces.IPaper, 
			cols: number, 
			rows: number
		) {
			this.paper = paper;
			this.cols = cols;
			this.rows = rows;

			// sets this.width and this.height
			this.size = this.resize(this.paper.sizingMode); 
			
			this.base = Playbook.Constants.GRID_BASE;
			this.divisor = 2; // TODO @theBull document this

			this.dashArray = ['- '];
			this.verticalStrokeOpacity = 0.2;
			this.horizontalStrokeOpacity = 0.25;
			this.strokeWidth = 0.5;
			this.color = '#000000';			
		}

		public getSize(): number {
			return this.size;
		}
		public getWidth(): number {
			return this.width;
		}
		public getHeight(): number {
			return this.height;
		}

		/**
		 * TODO @theBull - document this
		 * @return {any} [description]
		 */
		public draw(): void {

			var cols = this.cols;
			var rows = this.rows;
			//var font = this.paper.getFont('Arial');

			for(var c = 1; c < cols; c++) {
				var colX = c * this.size;
				var pathStr = Playbook.Utilities.getPathString(
					colX, 
					0, 
					colX, 
					rows * this.size
				);

				var p = this.paper.path(pathStr).attr({
					'stroke-dasharray': this.dashArray,
					'stroke-opacity': this.verticalStrokeOpacity,
					'stroke-width': this.strokeWidth,
					'stroke': this.color
				});
			}
			for(var r = 1; r < rows; r++) {
				var rowY = r * this.size;
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
						// let lineNumbersLeft = this.paper.print(
						// 	2,
						// 	r,
						// 	str,
						// 	font,
						// 	30
						// );.transform('r-90');
						let lineNumbersLeft = this.paper.text(
							2,
							r,
							str,
							false
						).transform('r-90');	

						// let lineNumbersRight = this.paper.print(
						// 	50, 
						// 	r, 
						// 	str, 
						// 	font, 
						// 	30
						// ).transform('r90');
						let lineNumbersRight = this.paper.text(
							50,
							r,
							str,
							false
						).transform('r90');
					}
					
					opacity = 1;
					this.paper.path(pathStr).attr({
						'stroke-opacity': this.horizontalStrokeOpacity,
						'stroke-width': 3,
						'stroke': '#ffffff'
					});
				} else {
					this.paper.path(pathStr).attr({
						'stroke-dasharray': this.dashArray,
						'stroke-opacity': this.horizontalStrokeOpacity,
						'stroke-width': this.strokeWidth,
						'stroke': this.color
					});
				}

				
			}
		}

		/**
		 * recalculates the width and height of the grid 
		 * with the context width and height
		 */
		public resize(sizingMode: Playbook.Editor.PaperSizingModes): number {
			if(this.cols <= 0)
				throw new Error('Grid cols must be defined and greater than 0');

			if(this.paper.canvas.width <= 0) 
				throw new Error('Canvas width must be greater than 0');

			switch(this.paper.sizingMode) {
				case Playbook.Editor.PaperSizingModes.TargetGridWidth:					
					this.size = Playbook.Constants.GRID_SIZE;
					break;
				case Playbook.Editor.PaperSizingModes.MaxCanvasWidth:
					this.size = Math.floor(
						this.paper.canvas.width / this.cols
					);
					break;
				case Playbook.Editor.PaperSizingModes.PreviewWidth:
					this.size = this.paper.canvas.width / this.cols // don't round
					break;
			}

			this.width = this.cols * this.size;
			this.height = this.rows * this.size;
			return this.size;
		}

		/**
		 * TODO @theBull - document this
		 * returns the grid value for the bottom-most grid line (horizontal)
		 * @return {number} [description]
		 */
		public bottom(): number {
			return this.rows;
		}

		/**
		 * TODO @theBull - document this
		 * returns the grid value for the right-most grid line (vertical)
		 * @return {number} [description]
		 */
		public right(): number {
			return this.cols;
		}

		/**
		 * TODO @theBull - document this
		 * @return {Playbook.Models.Coordinate} [description]
		 */
		public getCenter(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(
				Math.round(this.cols / 2),
				Math.round(this.rows / 2)
			);
		}

		/**
		 * TODO @theBull - document this
		 * @return {Playbook.Models.Coordinate} [description]
		 */
		public getCenterInPixels(): Playbook.Models.Coordinate {
			return this.getPixelsFromCoordinates(this.getCenter());
		}

		/**
		 * TODO @theBull - document this
		 * @return {Playbook.Models.Coordinate} [description]
		 */
		public getCoordinates(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(-1, -1); // TODO
		}

		/**
		 * TODO @theBull - document this
		 * @return {Playbook.Models.Coordinate} [description]
		 */
		public getDimensions(): Playbook.Models.Coordinate {
			return new Playbook.Models.Coordinate(
				this.cols, this.rows
			);
		}

		/**
		 * TODO @theBull - document this
		 * @return {number} [description]
		 */
		public gridProportion(): number {
			return this.size / this.base;
		}

		/**
		 * TODO @theBull - document this
		 * @param  {number} val [description]
		 * @return {number}     [description]
		 */
		public computeGridZoom(val: number): number {
			return val * this.gridProportion();
		}

		/**
		 * Calculates a single absolute pixel value from the given grid value
		 * @param  {number} val the coord value to calculate
		 * @return {number}     The calculated absolute pixel
		 */
		public getPixelsFromCoordinate(val: number): number {
			return val * this.size;
		}

		/**
		 * Returns the absolute pixel values of the given grid coords
		 * @param  {Playbook.Models.Coordinate} coords the grid coords to calculate
		 * @return {Playbook.Models.Coordinate}        the absolute pixel coords
		 */
		public getPixelsFromCoordinates(coords: Playbook.Models.Coordinate): Playbook.Models.Coordinate {
			let calculatedCoords = new Playbook.Models.Coordinate(
				this.getPixelsFromCoordinate(coords.x),
				this.getPixelsFromCoordinate(coords.y)
			);
			return calculatedCoords;
		}

		/**
		 * Calculates grid coords from the given pixel values
		 * @param {Playbook.Models.Coordinate} coords coordinates in raw pixel form
		 * @return {Playbook.Models.Coordinate}		the matching grid pixels as coords
		 */
		public getGridCoordinatesFromPixels(
			coords: Playbook.Models.Coordinate
		): Playbook.Models.Coordinate {

			// TODO: add in paper scroll offset
			var x = Math.round((coords.x / this.size) * this.divisor) / this.divisor;
			var y = Math.round((coords.y / this.size) * this.divisor) / this.divisor;

			return new Playbook.Models.Coordinate(x, y);
		}

		/**
		 * Takes the given coords and snaps them to the nearest grid coords
		 * 
		 * @param {Playbook.Models.Coordinate} coords Coordinates to snap
		 * @return {Playbook.Models.Coordinate}		The nearest snapped coordinates
		 */
		public snapToNearest(
			coords: Playbook.Models.Coordinate
		): Playbook.Models.Coordinate {
			return this.getGridCoordinatesFromPixels(coords);
		}

		/**
		 * Snaps the given coords to the grid
		 * @param {Playbook.Models.Coordinate} coords assumed non-snapped coordinates
		 * @return {Playbook.Models.Coordinate}		the snapped coordinates
		 */
		public snap(coords: Playbook.Models.Coordinate)
			: Playbook.Models.Coordinate {
			var snapX = this.snapPixel(coords.x);
			var snapY = this.snapPixel(coords.y);
			return new Playbook.Models.Coordinate(snapX, snapY);
		}

		/**
		 * takes a pixel value and translates it into a corresponding 
		 * number of grid units
		 * 
		 * @param  {number} val value to calculate
		 * @return {number}     calculated value
		 */
		public snapPixel(val: number): number {
			return Math.round(
				val / (this.size / this.divisor)
			) * (this.size / this.divisor);
		}

		/**
		 * Determines whether the given value is equally divisible
		 * by the gridsize
		 * 
		 * @param {number} val The value to calculate
		 * @return {boolean}	true if divisible, otherwise false
		 */
		public isDivisible(val: number): boolean {
			return val % (this.size / this.divisor) == 0;
		}

		/**
		 * [moveToPixels description]
		 * @param  {Playbook.Models.Coordinate} from [description]
		 * @param  {number}                     toX  [description]
		 * @param  {number}                     toY  [description]
		 * @return {Playbook.Models.Coordinate}      [description]
		 */
		public moveToPixels(
			from: Playbook.Models.Coordinate, 
			toX: number, 
			toY: number
		): Playbook.Models.Coordinate {
			throw new Error('Grid.moveToPixels() not implemented');
		}
	}
}