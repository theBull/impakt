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
			this.graphics.setOffsetXY(
				-this.player.graphics.dimensions.getWidth() / 2,
				- this.player.graphics.dimensions.getHeight() / 2
			);
			this.graphics.initializePlacement(
				new Common.Models.Placement(0, 0, this.player)
			);
		}

		public draw(): void {
			this.graphics.rect();
			this.graphics.hide();
		}
	}
}