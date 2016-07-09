/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerIndexLabel
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super();
			this.player = player;
			this.initialize(this.player.field, this.player);
			this.layer.type = Common.Enums.LayerTypes.PlayerIndexLabel;
			this.selectable = false;
			this.graphics.snapping = false;
			this.graphics.setOffsetXY(
				0, 
				(this.player.graphics.dimensions.getHeight() / 2) * 0.6
			);
			this.graphics.initializePlacement(
				new Common.Models.Placement(0, 0, this.player)
			);
		}

		public draw(): void {
			this.graphics.initializePlacement(
				new Common.Models.Placement(0, 0, this.player)
			);
			this.graphics.text((this.player.position.index).toString());
			this.graphics.setAttribute('class', 'no-highlight');
		}
	}
}