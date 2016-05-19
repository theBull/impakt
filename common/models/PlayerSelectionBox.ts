/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerSelectionBox
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super();
			this.player = player;
			this.initialize(this.player.field, this.player);
			this.layer.type = Common.Enums.LayerTypes.PlayerSelectionBox;
			this.selectable = false;
			this.graphics.setOriginalOpacity(1);
			this.graphics.setOriginalFill('');
			this.graphics.setOriginalStroke('blue');
			this.graphics.setOriginalStrokeWidth(1);
			this.graphics.dimensions.width = (this.player.graphics.dimensions.getWidth());
			this.graphics.dimensions.height = (this.player.graphics.dimensions.getHeight());
			this.graphics.dimensions.offset.x = -this.player.graphics.dimensions.getWidth() / 2;
			this.graphics.dimensions.offset.y = -this.player.graphics.dimensions.getHeight() / 2;
			this.graphics.updateLocation(
				this.player.graphics.location.ax + this.graphics.dimensions.offset.x,
				this.player.graphics.location.ay + this.graphics.dimensions.offset.y
			);
		}

		public draw(): void {
			this.graphics.rect();
		}
	}
}