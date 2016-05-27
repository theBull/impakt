/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayerSelectionBox
	extends Common.Models.PlayerSelectionBox
	implements Common.Interfaces.IPlayerSelectionBox {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
		}
	}
}