/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerPersonnelLabel
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super();
			this.player = player;
			this.initialize(this.player.field, this.player);
			this.layer.type = Common.Enums.LayerTypes.PlayerPersonnelLabel;
			this.selectable = false;
			this.graphics.dimensions.offset.y =
				-(this.player.graphics.dimensions.getHeight() / 2) * 0.4;
			this.graphics.updateLocation(
				this.player.graphics.location.ax,
				this.player.graphics.location.ay + this.graphics.dimensions.offset.y
			);
		}

		public draw(): void {
			this.graphics.text(this.player.position.label);
			this.graphics.setAttribute('class', 'no-highlight');
		}
	}
}