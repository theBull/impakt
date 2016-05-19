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
			this.graphics.dimensions.offset.y = 8;
			this.graphics.updateLocation(
				this.player.graphics.location.ax,
				this.player.graphics.location.ay + this.graphics.dimensions.offset.y
			);
		}	

		public draw(): void {
			this.graphics.text([
				this.graphics.placement.relative.rx, ', ',
				this.graphics.placement.relative.ry
			].join(''));
			this.graphics.setAttribute('class', 'no-highlight');
			this.layer.hide();
		}

	}

}