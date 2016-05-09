/// <reference path='./models.ts' />

module Common.Models {
	export class Dimensions 
	extends Common.Models.Modifiable {

		public width: number;
		public height: number;
		public minWidth: number;
		public minHeight: number;
		public length: number;
		public depth: number;
		public radius: number;
		public diameter: number;
		public perimeter: number;
		public circumference: number;
		public area: number;
		public circularArea: number;
		public offset: Common.Models.Offset;
		public rotation: number;

		constructor() {
			super();
			super.setContext(this);

			this.width = 0;
			this.height = 0;
			this.minWidth = 0;
			this.minHeight = 0;
			this.length = 0;
			this.depth = 0;
			this.radius = 0;
			this.diameter = 2 * this.radius;
			this.perimeter = 0;
			this.circumference = 0;
			this.area = 0;
			this.circularArea = 0;
			this.offset = new Common.Models.Offset(0, 0);
			this.rotation = 0;
		}

		public toJson(): any {
			return {
				width: this.width,
				height: this.height,
				minWidth: this.minWidth,
				minHeight: this.minHeight,
				length: this.length,
				depth: this.depth,
				radius: this.radius,
				diameter: this.diameter,
				perimeter: this.perimeter,
				area: this.area,
				circumference: this.circumference,
				offset: this.offset.toJson(),
				rotation: this.rotation
			}
		}

		public fromJson(json: any): any {
			if (!json)
				return;

			this.width = json.width;
			this.height = json.height;
			this.minWidth = json.minWidth;
			this.minHeight = json.minHeight;
			this.length = json.length;
			this.depth = json.depth;
			this.radius = json.radius;
			this.diameter = json.diameter;
			this.perimeter = json.perimeter;
			this.area = json.area;
			this.circumference = json.circumference;
			this.offset.fromJson(json.offset);
			this.rotation = json.rotation;
		}

		public calculateDimensions(): void {
			this._calculateDiameter();
			this._calculateArea();
			this._calculatePerimeter();
			this._calculateCircumference();
			this._calculateCircularArea();

			//this.setModified(true);
		}

		public getHeight(): number {
			return this.height;
		}
		public setHeight(height: number): void {
			this.height = height;
			this.calculateDimensions();
		}

		public getWidth(): number {
			return this.width;
		}
		public setWidth(width: number): void {
			this.width = width;
			this.calculateDimensions();			
		}

		public getMinWidth(): number {
			return this.minWidth;
		}
		public setMinWidth(minWidth: number): void {
			this.minWidth = minWidth;

			// only recalculate / set as modified if
			// the minWidth is greater then the current width;
			// enforce that the width isn't less than the minWidth
			if (this.minWidth > this.width)
				this.setWidth(this.minWidth);
		}

		public getMinHeight(): number {
			return this.minHeight;
		}
		public setMinHeight(minHeight: number): void {
			this.minHeight = minHeight;

			// only recalculate / set as modified if
			// the minHeight is greater then the current height;
			// enforce that the height isn't less than the minHeight
			if (this.minHeight > this.height)
				this.setHeight(this.minHeight);
		}

		/**
		 * Mostly for line segments
		 * @return {number} [description]
		 */
		public getLength(): number {
			return this.length;
		}
		public setLength(length: number): void {
			this.length = length;

		}
		
		public getDepth(): number {
			return this.depth;
		}
		public setDepth(depth: number): void {
			this.depth = depth;
			//this.setModified(true);
		}

		public getRadius(): number {
			return this.radius;
		}
		public setRadius(radius: number): void {
			this.radius = radius;
			this.calculateDimensions();
		}

		public getDiameter(): number {
			return this.diameter;
		}
		public setDiameter(diameter: number): void {
			this.diameter = diameter;
			this.radius = this.diameter / 2;
			//this.setModified(true);
		}
		private _calculateDiameter(): number {
			this.diameter = this.getRadius() * 2;
			return this.diameter;
		}

		public getPerimeter(): number {
			return this.perimeter;
		}
		private _calculatePerimeter(): number {
			this.perimeter = (this.height * 2) + (this.width * 2);
			return this.perimeter;
		}
		public getArea(): number {
			return this.area;			
		}
		private _calculateArea(): number {
			this.area = this.height * this.width;
			return this.area;
		}
		public getCircumference(): number {
			return this.circumference;
		}
		private _calculateCircumference(): number {
			this.circumference = 2 * Math.PI * this.getRadius();
			return this.circumference;
		}
		public getCircularArea(): number {
			return this.circularArea;
		}
		private _calculateCircularArea(): number {
			this.circularArea = Math.PI * Math.pow(this.getRadius(), 2);
			return this.circularArea;
		}

		public hasOffset(): boolean {
			return !Common.Utilities.isNullOrUndefined(this.offset);
		}
		public getOffset(): Common.Models.Offset {
			return this.offset;
		}
		public setOffset(offset: Common.Models.Offset): void {
			if (!this.hasOffset())
				this.offset = new Common.Models.Offset(offset.x, offset.y);

			else
				this.offset = offset;

			//this.setModified(true);
		}
		public getOffsetX(): number {
			return this.hasOffset() ? this.offset.getX() : null;
		}
		public setOffsetX(x: number): void {
			if (!this.hasOffset())
				this.offset = new Common.Models.Offset(x, 0);

			else
				this.offset.x = x;	

			//this.setModified(true);
		}
		public getOffsetY(): number {
			return this.hasOffset() ? this.offset.getY() : null;
		}
		public setOffsetY(y: number): void {
			if (!this.hasOffset())
				this.offset = new Common.Models.Offset(0, y);

			else
				this.offset.y = y;

			//this.setModified(true);
		}
		public setOffsetXY(x: number, y: number): void {
			this.offset.setXY(x, y);
			//this.setModified(true);
		}
	}
}