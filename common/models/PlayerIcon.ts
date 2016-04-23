/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerIcon
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super(player.field, player);
			this.player = player;

			this.layer.type = Common.Enums.LayerTypes.PlayerIcon;
			this.layer.graphics.setPlacement(this.player.layer.graphics.placement);
			this.layer.graphics.dimensions.offset.x = -this.layer.graphics.dimensions.getRadius();
			this.layer.graphics.dimensions.offset.y = -this.layer.graphics.dimensions.getRadius();
			this.layer.graphics.updateLocation(
				this.player.layer.graphics.location.ax,
				this.player.layer.graphics.location.ay
			);
		}

		public draw(): void {
			this.layer.graphics.circle();
		}
	}
}