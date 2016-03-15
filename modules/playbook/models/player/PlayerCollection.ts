/// <reference path='../models.ts' />

module Playbook.Models {

	export class PlayerCollection
		extends Common.Models.ModifiableCollection<Playbook.Models.Player> {

		constructor() {
			super();
		}
	}
}