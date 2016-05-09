/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayerIcon
	extends Common.Models.PlayerIcon {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);

			this.layer.graphics.fill = 'black';
			this.layer.graphics.setStrokeWidth(0);
		}
	}

}