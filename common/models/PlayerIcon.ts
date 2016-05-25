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
			this.graphics.initializePlacement(
				new Common.Models.Placement(0, 0, this.player)
			);
			this.flippable = true;
		}

		public draw(): void {
			switch (this.player.unitType) {
				case Team.Enums.UnitTypes.Offense:
					this.graphics.setOffsetXY(0, 0);
					this.graphics.circle();
					break;
				case Team.Enums.UnitTypes.Defense:
					this.graphics.setOffsetXY(0, 0);
					this.graphics.triangle();
					break;
				case Team.Enums.UnitTypes.SpecialTeams:
					this.graphics.setOffsetXY(
						-(this.graphics.dimensions.getWidth() / 2),
						-(this.graphics.dimensions.getHeight() / 2)
					);
					this.graphics.initializePlacement(
						new Common.Models.Placement(0, 0, this.player)
					);
					this.graphics.rect();
					break;
				case Team.Enums.UnitTypes.Other:
					this.graphics.setOffsetXY(
						-(this.graphics.dimensions.getWidth() / 2),
						-(this.graphics.dimensions.getHeight() / 2)
					);
					this.graphics.initializePlacement(
						new Common.Models.Placement(0, 0, this.player)
					);
					this.graphics.rhombus();
					break;
			}
		}
	}
}