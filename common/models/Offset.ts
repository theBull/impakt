/// <reference path='./models.ts' />

module Common.Models {
	export class Offset 
	extends Common.Models.Modifiable {

		public x: number;
		public y: number;

		constructor(x: number, y: number) {
			super();
			super.setContext(this);

			this.x = x || 0;
			this.y = y || 0;

			this.onModified(function() {
				//console.log('offset modified');
			});
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

		public set(offset: Common.Models.Offset): void {
			this.x = offset.x;
			this.y = offset.y;
			this.setModified(true);
		}

		public hasXY(): boolean {
			return this.hasX() && this.hasY();
		}
		public hasX(): boolean {
			return Common.Utilities.isNullOrUndefined(this.x);
		}
		public getX(): number {
			return this.x;
		}
		public setX(x: number): void {
			this.x = x;
			this.setModified(true);
		}
		public hasY(): boolean {
			return Common.Utilities.isNullOrUndefined(this.y);
		}
		public getY(): number {
			return this.y;
		}
		public setY(y: number): void {
			this.y = y;
			this.setModified(true);
		}
		public setXY(x: number, y: number) {
			this.x = x;
			this.y = y;
			this.setModified(true);
		}

	}
}