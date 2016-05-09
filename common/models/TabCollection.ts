/// <reference path='./models.ts' />

module Common.Models {
	export class TabCollection
	extends Common.Models.ModifiableCollection<Common.Models.Tab> {
		constructor() {
			super();
		}

		public getByPlayGuid(guid: string): Common.Models.Tab {
			return this.filterFirst(function(tab, index) {
				return tab.play.guid == guid;
			});
		}

		public close(tab: Common.Models.Tab): void {
			this.remove(tab.guid);
			tab.close();
		}
	}
}