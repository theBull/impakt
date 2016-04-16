/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayerPersonnelLabel
	extends Common.Models.PlayerPersonnelLabel {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
		}

		public draw(): void {
			// player label not visible for preview player
		}
	}
}