/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayerSelectionBox
	extends Common.Models.PlayerSelectionBox
	implements Common.Interfaces.IPlayerSelectionBox {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
		}

		public draw(): void {
			// preview selection box not visible
		}
	}
}