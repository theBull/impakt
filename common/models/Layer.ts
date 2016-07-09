/// <reference path='./models.ts' />

module Common.Models {

	export class Layer
	extends Common.Models.Modifiable {

		public actionable: Common.Interfaces.IActionable;
		public type: Common.Enums.LayerTypes;
		public zIndex: number;
		public layers: Common.Models.LayerCollection;
		public visible: boolean;
		public name: string;

		constructor(actionable: Common.Interfaces.IActionable, layerType: Common.Enums.LayerTypes) {
			if (Common.Utilities.isNullOrUndefined(actionable)) {
				throw new Error('Layer constructor(): actionable is null or undefined');
			}

			super();
			super.setContext(this);

			this.actionable = actionable;
			this.type = layerType;
			this.visible = true;
			this.name = '';

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

			return this.guid == layer.guid || 
				this.layers.hasElementWhich(function(layer: Common.Models.Layer, index: number) {
					return self.guid == layer.guid;
				});
		}

		public containsLayerType(type: Common.Enums.LayerTypes): boolean {
			if(!this.hasLayers())
				return false;

			let self = this;
			return this.type == type || 
				this.layers.hasElementWhich(function(layer: Common.Models.Layer, index: number) {
					return self.type == layer.type;
				});
		}

		public addLayer(layer: Common.Models.Layer, unique?: boolean): void {
			this.layers.listen(false);
			if(this.hasLayers()) {
				this.layers.add(layer);
			}

			if(this.hasGraphics())
				this.actionable.graphics.set.push(layer.actionable.graphics);

			this.layers.listen(true);
		}

		public removeLayer(layer: Common.Models.Layer): void {
			if (layer.guid == this.guid) {
				this.remove();
			} else if(this.hasLayers()) {
				// search sub layers
				this.layers.forEach(function(subLayer: Common.Models.Layer, index: number) {
					// layer exists somewhere down the chain...
					subLayer.removeLayer(layer);					
				});
			}
		}
		public removeLayerByType(type: Common.Enums.LayerTypes): void {
			if(type == this.type) {
				this.remove();
			} else if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.removeLayerByType(type);
				});
				this.layers.removeWhere(function(layer: Common.Models.Layer) {
					return layer.type == type;
				});
			}
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
			
			if(this.hasGraphics())
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
			
			if(this.hasGraphics())
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
			if(this.hasGraphics()) {
				this.actionable.graphics.remove();
			}
		}

		public moveByDelta(dx: number, dy: number) {
			if(this.hasGraphics())
				this.actionable.graphics.moveByDelta(dx, dy);

			if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.moveByDelta(dx, dy);
				});
			}
		}

		public drop(): void {
			if(this.hasGraphics())
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
			if(this.hasGraphics())
				this.actionable.graphics.flip(this.actionable.flippable);

			if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.flip();
				});
			}
		}
	}

}