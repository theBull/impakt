/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorPlayerPersonnelLabel
	extends Common.Models.PlayerPersonnelLabel {

		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
		}
	}
}