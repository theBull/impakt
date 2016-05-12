/// <reference path='./models.ts' />

module Common.Models {

	export class LayerCollection
	extends Common.Models.Collection<Common.Models.Layer> {

		constructor() {
			super();

			this.onModified(function() {});
		}

		public dragAll(dx: number, dy: number): void {
			// Not implemented
		}

		public removeAll(): void {
			// Recursively remove all sub layers
			this.forEach(function(layer: Common.Models.Layer, index: number) {
				layer.remove();
			});
			super.removeAll();
		}

		public drop(): void {
			this.forEach(function(layer: Common.Models.Layer, index: number) {
				if(layer.hasGraphics())
					layer.graphics.drop();
			});
		}

		public hide(): void {
			this.forEach(function(layer: Common.Models.Layer, index: number) {
				if(layer.hasGraphics()) {
					layer.graphics.hide();
					if(layer.graphics.hasSet()) {
						layer.graphics.set.hide();
					}
				}
			});
		}

	}

}