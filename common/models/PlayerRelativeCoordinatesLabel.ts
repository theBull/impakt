/// <reference path='./models.ts' />

module Common.Models {

	export abstract class PlayerRelativeCoordinatesLabel
	extends Common.Models.FieldElement {

		public player: Common.Interfaces.IPlayer;

		constructor(player: Common.Interfaces.IPlayer) {
			super(player.field, player);

			this.player = player;
			this.layer.type = Common.Enums.LayerTypes.PlayerRelativeCoordinatesLabel;
			this.layer.graphics.selectable = false;
			this.layer.graphics.dimensions.offset.y = 8;
			this.layer.graphics.updateLocation(
				this.player.layer.graphics.location.ax,
				this.player.layer.graphics.location.ay + this.layer.graphics.dimensions.offset.y
			);
		}	

		public draw(): void {
			this.layer.graphics.text([
				this.layer.graphics.placement.relative.rx, ', ',
				this.layer.graphics.placement.relative.ry
			].join(''));
			this.layer.graphics.setAttribute('class', 'no-highlight');
			this.layer.hide();
		}

	}

}