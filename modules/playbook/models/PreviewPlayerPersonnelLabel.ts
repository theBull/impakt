/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayerPersonnelLabel
	extends Common.Models.PlayerPersonnelLabel {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
		}
	}
}