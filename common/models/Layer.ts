/// <reference path='./models.ts' />

module Common.Models {

	export class Layer
	extends Common.Models.Modifiable {

		public paper: Common.Interfaces.IPaper;
		public graphics: Common.Models.Graphics;
		public type: Common.Enums.LayerTypes;
		public zIndex: number;
		public layers: Common.Models.LayerCollection;
		public visible: boolean;

		constructor(paper: Common.Interfaces.IPaper, layerType: Common.Enums.LayerTypes) {
			super();
			super.setContext(this);

			this.paper = paper;
			this.graphics = new Common.Models.Graphics(this.paper);
			this.type = layerType;
			this.visible = true;

			// sub layers
			this.layers = new Common.Models.LayerCollection();

			let self = this;
			this.graphics.onModified(function() {
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
			if(this.hasLayers())
				this.layers.add(layer);

			this.graphics.set.push(layer.graphics);
		}

		public removeLayer(layer: Common.Models.Layer): Common.Models.Layer {
			if (this.hasGraphics())
				layer.graphics.remove();

			this.graphics.set.exclude(layer.graphics);

			return this.hasLayers() ? this.layers.remove(layer.guid) : null;
		}

		public removeAllLayers(): void {
			if (this.hasLayers())
				this.layers.removeAll();
		}

		public toFront(): void {
			if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					if(layer && layer.graphics) {
						layer.graphics.toFront();
					}
				});
			}
		}

		public toBack(): void {
			if (this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					if (layer && layer.graphics) {
						layer.graphics.toBack();
					}
				});
			}
		}

		public show(): void {
			this.visible = true;
			this.graphics.show();
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
			this.graphics.hide();
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
				this.graphics.remove();
		}

		public moveByDelta(dx: number, dy: number) {
			this.graphics.moveByDelta(dx, dy);
			if(this.hasLayers()) {
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.moveByDelta(dx, dy);
				});
			}
		}

		public drop(): void {
			this.graphics.drop();
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
			return this.graphics != null && this.graphics != undefined;
		}

		public hasPlacement(): boolean {
			return this.hasGraphics() && this.graphics.hasPlacement();
		}

		/**
		 * Draws the current layer and its nested layers (recursive)
		 */
		public draw(): void {
			if (this.hasGraphics())
				this.graphics.draw();

			if(this.hasLayers() && this.layers.hasElements())
				this.layers.forEach(function(layer: Common.Models.Layer, index: number) {
					layer.draw();
				});
		}
	}

}