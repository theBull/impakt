/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerSelectionBox
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super(player.field, player.ball);

			this.player = player;
			this.layer.graphics.selectable = false;
			this.layer.graphics.setOriginalOpacity(1);
			this.layer.graphics.setOriginalFill('');
			this.layer.graphics.setOriginalStroke('blue');
			this.layer.graphics.setOriginalStrokeWidth(1);
			this.layer.graphics.dimensions.width = (this.player.layer.graphics.dimensions.getWidth());
			this.layer.graphics.dimensions.height = (this.player.layer.graphics.dimensions.getHeight());
			this.layer.graphics.dimensions.offset.x = -this.player.layer.graphics.dimensions.getWidth() / 2;
			this.layer.graphics.dimensions.offset.y = -this.player.layer.graphics.dimensions.getHeight() / 2;
			this.layer.graphics.updateLocation(
				this.player.layer.graphics.location.ax + this.layer.graphics.dimensions.offset.x,
				this.player.layer.graphics.location.ay + this.layer.graphics.dimensions.offset.y
			);
		}

		public draw(): void {
			this.layer.graphics.rect();
		}
	}
}