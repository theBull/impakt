/// <reference path='./models.ts' />

module Common.Models {
	export class Grid
	implements Common.Interfaces.IGrid {

		public canvas: Common.Interfaces.ICanvas;
		public cols: number;
		public rows: number;
		public dimensions: Common.Models.Dimensions;
		public divisor: number;
		public size: number;
		public dashArray: Array<string>;
		public verticalStrokeOpacity: number;
		public horizontalStrokeOpacity: number;
		public color: string;
		public strokeWidth: number;
		protected base: number;
		public snapping: boolean;

		constructor(
			canvas: Common.Interfaces.ICanvas, 
			cols: number, 
			rows: number
		) {
			this.canvas = canvas;
			this.cols = cols;
			this.rows = rows;
			this.dimensions = new Common.Models.Dimensions();
			this.dimensions.offset.x = 0;

			// sets this.width and this.height
			this.size = this.resize(this.canvas.sizingMode); 
			
			this.base = Playbook.Constants.GRID_BASE;
			this.divisor = 2; // TODO @theBull document this

			this.dashArray = ['- '];
			this.verticalStrokeOpacity = 0.2;
			this.horizontalStrokeOpacity = 0.25;
			this.strokeWidth = 0.5;
			this.color = '#000000';

			this.snapping = true;			
		}

		public getSize(): number {
			return this.size;
		}
		public getWidth(): number {
			return this.dimensions.width;
		}
		public getHeight(): number {
			return this.dimensions.height;
		}
		public setSnapping(snapping: boolean): void {
			this.snapping = snapping;
		}
		public toggleSnapping(): void {
			this.snapping = !this.snapping;
		}

		/**
		 * TODO @theBull - document this
		 * @return {any} [description]
		 */
		public draw(): void {

			var cols = this.cols;
			var rows = this.rows;
			//var font = this.canvas.getFont('Arial');

			for(var c = 1; c <= cols; c++) {
				var colX = c * this.size;
				var pathStr = Common.Drawing.Utilities.getPathString(true, [
					colX, 
					0, 
					colX, 
					rows * this.size
				]);

				var p = this.canvas.drawing.path(pathStr).attr({
					'stroke-dasharray': this.dashArray,
					'stroke-opacity': this.verticalStrokeOpacity,
					'stroke-width': this.strokeWidth,
					'stroke': this.color,
					'class': 'pointer-events-none'
				});
			}
			for(var r = 1; r <= rows; r++) {
				var rowY = r * this.size;
				var pathStr = Common.Drawing.Utilities.getPathString(true, [
					this.getSize(), 
					rowY, 
					this.dimensions.width, 
					rowY
				]);

				var opacity: any, dashes: any;
				if (r % 10 == 0) {
					if(r > 10 && r < 100) {
						let value = (r - 10);
						if (value > 50)
							value = value - ((value - 50) * 2);

						let str = value.toString();
						// let lineNumbersLeft = this.canvas.print(
						// 	2,
						// 	r,
						// 	str,
						// 	font,
						// 	30
						// );.transform('r-90');
						let lineNumbersLeft = this.canvas.drawing.text(
							2,
							r,
							str,
							false
						).transform('r-90').attr({ 'class': 'no-highlight' });	

						// let lineNumbersRight = this.canvas.print(
						// 	50, 
						// 	r, 
						// 	str, 
						// 	font, 
						// 	30
						// ).transform('r90');
						let lineNumbersRight = this.canvas.drawing.text(
							50,
							r,
							str,
							false
						).transform('r90').attr({'class': 'no-highlight'});
					}
					
					opacity = 1;
					this.canvas.drawing.path(pathStr).attr({
						'stroke-opacity': this.horizontalStrokeOpacity,
						'stroke-width': 3,
						'stroke': '#ffffff',
						'class': 'pointer-events-none'
					});
				} else {
					this.canvas.drawing.path(pathStr).attr({
						'stroke-dasharray': this.dashArray,
						'stroke-opacity': this.horizontalStrokeOpacity,
						'stroke-width': this.strokeWidth,
						'stroke': this.color,
						'class': 'pointer-events-none'
					});
				}

				
			}
		}

		/**
		 * recalculates the width and height of the grid 
		 * with the context width and height
		 */
		public resize(sizingMode: Common.Enums.CanvasSizingModes): number {
			if(this.cols <= 0)
				throw new Error('Grid cols must be defined and greater than 0');

			let canvasWidth = this.canvas.dimensions.width;

			if (canvasWidth == 0)
				throw new Error('Grid canvas width must be greater than 0');

			switch(this.canvas.sizingMode) {
				case Common.Enums.CanvasSizingModes.TargetGridWidth:					
					this.size = Playbook.Constants.GRID_SIZE;
					break;
				case Common.Enums.CanvasSizingModes.MaxContainerWidth:
					this.size = Math.floor(this.canvas.dimensions.width / this.cols);
					break;
				case Common.Enums.CanvasSizingModes.PreviewWidth:
					this.size = this.canvas.dimensions.width / this.cols // don't round
					break;
			}

			this.dimensions.width = this.cols * this.size;
			this.dimensions.height = this.rows * this.size;
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
		public getCenter(): Common.Models.Coordinates {
			return new Common.Models.Coordinates(
				(Math.round(this.cols / 2) + this.dimensions.offset.x),
				Math.round(this.rows / 2)
			);
		}

		/**
		 * TODO @theBull - document this
		 * @return {Playbook.Models.Coordinate} [description]
		 */
		public getCenterInPixels(): Common.Models.Coordinates {
			let centerCoords = this.getCenter();
			return this.getAbsoluteFromCoordinates(centerCoords.x, centerCoords.y);
		}


		public getCursorOffset(offsetX: number, offsetY: number): Common.Models.Coordinates {
			let canvasOffsetX = offsetX + this.canvas.x - this.getSize(); // -1 for left sideline offset
			let canvasOffsetY = offsetY + this.canvas.y - (10 * this.getSize()); // -10 to account for endzones
			return new Common.Models.Coordinates(canvasOffsetX, canvasOffsetY);
		}
		public getCursorPositionAbsolute(offsetX: number, offsetY: number): Common.Models.Coordinates {
			return this.getCursorOffset(offsetX, offsetY);
		}
		public getCursorPositionCoordinates(offsetX: number, offsetY: number): Common.Models.Coordinates {
			let cursorOffset = this.getCursorOffset(offsetX, offsetY);
			return this.getCoordinatesFromAbsolute(cursorOffset.x, cursorOffset.y);
		}

		/**
		 * TODO @theBull - document this
		 * @return {Playbook.Models.Coordinate} [description]
		 */
		public getCoordinates(): Common.Models.Coordinates {
			return new Common.Models.Coordinates(-1, -1); // TODO
		}

		/**
		 * TODO @theBull - document this
		 * @return {Playbook.Models.Coordinate} [description]
		 */
		public getDimensions(): Common.Models.Dimensions {
			return this.dimensions;
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
		public getAbsoluteFromCoordinate(val: number): number {
			return val * this.size;
		}

		/**
		 * Returns the absolute pixel values of the given grid coords
		 * @param  {Common.Models.Coordinate} coords the grid coords to calculate
		 * @return {Common.Models.Coordinate}        the absolute pixel coords
		 */
		public getAbsoluteFromCoordinates(x: number, y: number): Common.Models.Coordinates {
			let coords = new Common.Models.Coordinates(x, y);
			let calculatedCoords = new Common.Models.Coordinates(
				this.getAbsoluteFromCoordinate(coords.x + this.dimensions.offset.x),
				this.getAbsoluteFromCoordinate(coords.y)
			);
			return calculatedCoords;
		}

		/**
		 * Calculates grid coords from the given pixel values
		 * @param {Playbook.Models.Coordinate} coords coordinates in raw pixel form
		 * @return {Playbook.Models.Coordinate}		the matching grid pixels as coords
		 */
		public getCoordinatesFromAbsolute(x: number, y: number): Common.Models.Coordinates {
			// TODO: add in canvas scroll offset
			let coordX = Math.round((x / this.size) * this.divisor) / this.divisor;
			let coordY = Math.round((y / this.size) * this.divisor) / this.divisor;

			return new Common.Models.Coordinates(coordX + this.dimensions.offset.x, coordY);
		}

		public getRelativeFromAbsolute(ax: number, ay: number, relativeElement: Common.Models.FieldElement)
		: Common.Models.RelativeCoordinates {
			//let coords = this.getCoordinatesFromAbsolute(ax, ay);
			throw new Error('grid getRelativeFromAbsolute(): not implemented');
		}

		/**
		 * Takes the given coords and snaps them to the nearest grid coords
		 * 
		 * @param {Playbook.Models.Coordinate} coords Coordinates to snap
		 * @return {Playbook.Models.Coordinate}		The nearest snapped coordinates
		 */
		public snapToNearest(ax: number, ay: number): Common.Models.Coordinates {
			return this.getCoordinatesFromAbsolute(ax, ay);
		}

		/**
		 * Snaps the given coords to the grid
		 * @param {Playbook.Models.Coordinate} coords assumed non-snapped coordinates
		 * @return {Playbook.Models.Coordinate}		the snapped coordinates
		 */
		public snap(x: number, y: number): Common.Models.Coordinates {
			let coords = new Common.Models.Coordinates(x, y);
			var snapX = this.snapPixel(coords.x);
			var snapY = this.snapPixel(coords.y);
			return new Common.Models.Coordinates(snapX, snapY);
		}

		/**
		 * takes a pixel value and translates it into a corresponding 
		 * number of grid units
		 * 
		 * @param  {number} val value to calculate
		 * @return {number}     calculated value
		 */
		public snapPixel(val: number): number {
			return (Math.round(val / (this.size / this.divisor)) * (this.size / this.divisor)) + this.dimensions.offset.x;
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
	}
}