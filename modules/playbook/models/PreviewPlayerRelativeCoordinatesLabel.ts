/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewPlayerRelativeCoordinatesLabel
	extends Common.Models.PlayerRelativeCoordinatesLabel
	implements Common.Interfaces.IPlayerRelativeCoordinatesLabel {
		constructor(player: Common.Interfaces.IPlayer) {
			super(player);
		}
	}
}