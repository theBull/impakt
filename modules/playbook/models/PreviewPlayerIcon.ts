/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayerIcon
	extends Common.Models.PlayerIcon {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);

			this.layer.graphics.fill = 'black';
			this.layer.graphics.setStrokeWidth(0);
			this.layer.graphics.dimensions.setRadius(this.grid.getSize() / 2);
			this.layer.graphics.dimensions.setWidth(this.layer.graphics.dimensions.getDiameter());
			this.layer.graphics.dimensions.setHeight(this.layer.graphics.dimensions.getDiameter());
		}
	}

}