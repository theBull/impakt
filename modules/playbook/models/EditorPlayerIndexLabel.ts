/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayerIndexLabel
	extends Common.Models.PlayerIndexLabel
	implements Common.Interfaces.IPlayerIndexLabel {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
		}
	}
}