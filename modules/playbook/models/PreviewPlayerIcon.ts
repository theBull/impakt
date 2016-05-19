/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayerIcon
	extends Common.Models.PlayerIcon {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
			this.graphics.fill = 'black';
			this.graphics.setStrokeWidth(0);
		}
	}

}