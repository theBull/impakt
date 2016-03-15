/// <reference path='../models.ts' />

module Playbook.Models {
	export class TabCollection
	extends Common.Models.Collection<Playbook.Models.Tab> {
		constructor() {
			super();
		}

		public getByPlayGuid(guid: string): Playbook.Models.Tab {
			return this.filterFirst(function(tab, index) {
				return tab.play.guid == guid;
			});
		}
	}
}