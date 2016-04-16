/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayerIndexLabel
	extends Common.Models.PlayerIndexLabel
	implements Common.Interfaces.IPlayerIndexLabel {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
		}

		public draw(): void {
			// player index is not visible in preview mode
		}
	}
}