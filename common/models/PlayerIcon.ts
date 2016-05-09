/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerIcon
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super(player.field, player);
			this.player = player;

			this.layer.type = Common.Enums.LayerTypes.PlayerIcon;
			this.layer.graphics.dimensions.setRadius(this.grid.getSize() / 2);
			this.layer.graphics.dimensions.setWidth(this.player.layer.graphics.dimensions.getWidth());
			this.layer.graphics.dimensions.setHeight(this.player.layer.graphics.dimensions.getHeight());
			this.layer.graphics.setPlacement(player.layer.graphics.placement);
			// this.layer.graphics.dimensions.offset.x = -this.layer.graphics.dimensions.getRadius();
			// this.layer.graphics.dimensions.offset.y = -this.layer.graphics.dimensions.getRadius();
			this.layer.graphics.updateLocation(
				this.player.layer.graphics.location.ax,
				this.player.layer.graphics.location.ay
			);
		}

		public draw(): void {
			switch (this.player.position.unitType) {
				case Team.Enums.UnitTypes.Offense:
					this.layer.graphics.circle();
					break;
				case Team.Enums.UnitTypes.Defense:
					this.layer.graphics.triangle();
					break;
				case Team.Enums.UnitTypes.SpecialTeams:
					this.layer.graphics.rect();
					break;
				case Team.Enums.UnitTypes.Other:
					this.layer.graphics.rhombus();
					break;
			}
		}
	}
}