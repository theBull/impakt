/// <reference path='../models.ts' />

module Playbook.Models {
	export class TabCollection
	extends Common.Models.Collection<Playbook.Models.Tab> {
		constructor() {
			super();
		}

		public getByPlayGuid(guid: string): Playbook.Models.Tab {
			let results = null;
			this.forEach(function(tab, index) {
				if(tab && tab.play && tab.play.guid == guid) {
					results = tab;
				}
			});
			return results;
		}
	}
}