/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerIndexLabel
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super(player.field, player);

			this.player = player;
			this.layer.type = Common.Enums.LayerTypes.PlayerIndexLabel;
			this.layer.graphics.selectable = false;
			this.layer.graphics.dimensions.offset.y = 
				(this.player.layer.graphics.dimensions.getHeight() / 2) * 0.4;
			this.layer.graphics.updateLocation(
				this.player.layer.graphics.location.ax,
				this.player.layer.graphics.location.ay + this.layer.graphics.dimensions.offset.y
			);
		}

		public draw(): void {
			this.layer.graphics.text((this.player.position.index).toString());
			this.layer.graphics.setAttribute('class', 'no-highlight');
		}
	}
}