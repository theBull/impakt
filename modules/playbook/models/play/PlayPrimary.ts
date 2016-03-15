/// <reference path='../models.ts' />

module Playbook.Models {

	export class PlayPrimary 
	extends Playbook.Models.Play {

		public playType: Playbook.Editor.PlayTypes;

		constructor() {
			super();
			this.playType = Playbook.Editor.PlayTypes.Primary;
		}

	}
}