/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerRelativeCoordinatesLabel
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super();
			this.player = player;
			this.initialize(this.player.field, this.player);
			this.layer.type = Common.Enums.LayerTypes.PlayerRelativeCoordinatesLabel;
			this.selectable = false;
			this.graphics.snapping = false;
			this.graphics.setOffsetXY(
				0, 
				this.grid.getSize()
			);
			this.graphics.initializePlacement(
				new Common.Models.Placement(0, 0, this.player)
			);
		}	

		public draw(): void {
			this.graphics.text([
				this.player.graphics.placement.relative.rx, ', ',
				this.player.graphics.placement.relative.ry
			].join(''));
			this.graphics.setAttribute('class', 'no-highlight');
			this.layer.hide();
		}

	}

}