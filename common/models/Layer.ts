/// <reference path='./models.ts' />

module Common.Models {

	export class Layer
	extends Common.Models.Modifiable {

		public actionable: Common.Interfaces.IActionable;
		public type: Common.Enums.LayerTypes;
		public zIndex: number;
		public layers: Common.Models.LayerCollection;
		public visible: boolean;

		constructor(actionable: Common.Interfaces.IActionable, layerType: Common.Enums.LayerTypes) {
			if (Common.Utilities.isNullOrUndefined(actionable)) {
				throw new Error('Layer constructor(): actionable is null or undefined');
			}

			super();
			super.setContext(this);

			this.actionable = actionable;
			this.type = layerType;
			this.visible = true;

			// sub layers
			this.layers = new Common.Models.LayerCollection();

			let self = this;
			this.onModified(function() {
				self.setModified(true);
			});
		}

		public containsLayer(layer: Common.Models.Layer): boolean {
			if (!this.hasLayers())
				return false;

			let self = this;

			let predicate = function(layer: Common.Models.Layer, index: number) {
				return self.guid == layer.guid;
			};

			return this.guid == layer.guid || this.layers.hasElementWhich(predicate);
		}

		public addLayer(layer: Common.Models.Layer): void {
			this.layers.listen(false);
			if(this.hasLayers())
				this.layers.add(layer);

			this.actionable.graphics.set.push(layer.actionable.graphics);
			this.layers.listen(true);
		}

		public removeLayer(layer: Common.Models.Layer): Common.Models.Layer {
			if (this.hasGraphics())
				layer.actionable.graphics.remove();

			this.actionable.graphics.set.exclude(layer.actionable.graphics);

			return this.hasLayers() ? this.layers.remove(layer.guid) : null;
		}

		public removeAllLayers(): void {
			if (this.hasLayers())
				this.layers.removeAll();
		}

		public toFront(): void {
			if(this.hasGraphics()) {
				this.actionable.graphics.toFront();
			}
			if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					if(layer && layer.actionable.graphics) {
						layer.actionable.graphics.toFront();
					}
				});
			}
		}

		public toBack(): void {
			if (this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					if (layer && layer.actionable.graphics) {
						layer.actionable.graphics.toBack();
					}
				});
			}
		}

		public show(): void {
			this.visible = true;
			this.actionable.graphics.show();
			this.showLayers();
		}

		public showLayers(): void {
			this.visible = true;
			if(this.hasLayers())
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.show();
				});
		}

		public hide(): void {
			this.visible = false;
			this.actionable.graphics.hide();
			this.hideLayers();
		}

		public hideLayers(): void {
			if(this.hasLayers())
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.hide();
				});
		}

		public remove(): void {
			this.removeGraphics();
			this.removeAllLayers();
		}

		public removeGraphics(): void {
			if (this.hasGraphics())
				this.actionable.graphics.remove();
		}

		public moveByDelta(dx: number, dy: number) {
			this.actionable.graphics.moveByDelta(dx, dy);
			if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.moveByDelta(dx, dy);
				});
			}
		}

		public drop(): void {
			this.actionable.graphics.drop();
			if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.drop();
				});
			}
		}

		public hasLayers(): boolean {
			return this.layers != null && this.layers != undefined;
		}

		public hasGraphics(): boolean {
			return Common.Utilities.isNotNullOrUndefined(this.actionable) &&
				Common.Utilities.isNotNullOrUndefined(this.actionable.graphics);
		}

		public hasPlacement(): boolean {
			return this.hasGraphics() && this.actionable.graphics.hasPlacement();
		}

		/**
		 * Draws the current layer and its nested layers (recursive)
		 */
		public draw(): void {
			if (this.hasGraphics())
				this.actionable.graphics.draw();

			if(this.hasLayers() && this.layers.hasElements())
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.draw();
				});
		}

		public flip(): void {
			this.actionable.graphics.flip(this.actionable.flippable);

			if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.flip();
				});
			}
		}
	}

}