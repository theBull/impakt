/// <reference path='./models.ts' />

module Common.Models {
	export class DrawingHandler {

		public callbacks: Function[];
		public graphics: Common.Models.Graphics;

		constructor(graphics: Common.Models.Graphics) {
			this.callbacks = [];
		}

		public ondraw(callback: Function): void {
			if (!this.callbacks)
				throw new Error('Drawable ondraw(): callbacks array is null or undefined');

			this.callbacks.push(callback);
		}

		public draw(): void {
			if (!this.callbacks)
				return;

			for (let i = 0; i < this.callbacks.length; i++) {
				let callback = this.callbacks[i];
				if (callback && typeof callback == 'Function')
					callback(this.graphics);
			}
		}
	}
}