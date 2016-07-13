/// <reference path='./models.ts' />

module Playbook.Models {

	export class PlaybookAPIOptions
	extends Common.Models.APIOptions {

		public scenario: Common.API.Actions;
		public play: Common.API.Actions;
		public formation: Common.API.Actions;
		public assignmentGroup: Common.API.Actions;

		constructor(entity: Common.Interfaces.IAssociable) {
			super(entity);
			this.scenario = Common.API.Actions.Nothing;
			this.play = Common.API.Actions.Nothing;
			this.formation = Common.API.Actions.Nothing;
			this.assignmentGroup = Common.API.Actions.Nothing;
		}
	}

}