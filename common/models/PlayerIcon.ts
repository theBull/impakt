/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerIcon
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super();
			this.player = player;
			this.initialize(this.player.field, this.player);
			this.layer.type = Common.Enums.LayerTypes.PlayerIcon;
			this.graphics.dimensions.setRadius(this.grid.getSize() / 2);
			this.graphics.dimensions.setWidth(this.player.graphics.dimensions.getWidth());
			this.graphics.dimensions.setHeight(this.player.graphics.dimensions.getHeight());
			this.graphics.setPlacement(this.player.graphics.placement);
			// this.graphics.dimensions.offset.x = -this.graphics.dimensions.getRadius();
			// this.graphics.dimensions.offset.y = -this.graphics.dimensions.getRadius();
			this.graphics.updateLocation(
				this.player.graphics.location.ax,
				this.player.graphics.location.ay
			);
		}

		public draw(): void {
			switch (this.player.position.unitType) {
				case Team.Enums.UnitTypes.Offense:
					this.graphics.circle();
					break;
				case Team.Enums.UnitTypes.Defense:
					this.graphics.triangle();
					break;
				case Team.Enums.UnitTypes.SpecialTeams:
					this.graphics.rect();
					break;
				case Team.Enums.UnitTypes.Other:
					this.graphics.rhombus();
					break;
			}
		}
	}
}