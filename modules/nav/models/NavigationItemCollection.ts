/// <reference path='./models.ts' />

module Navigation.Models {
	export class NavigationItemCollection
	extends Common.Models.Collection<Navigation.Models.NavigationItem> {

		constructor() {
			super();
		}

		public activate(navItem: Navigation.Models.NavigationItem) {
			this.forEach(function(item: Navigation.Models.NavigationItem, index: number) {
				item.deactivate();
			});
			navItem.activate();
		}

		public getActive(): Navigation.Models.NavigationItem {
			return this.filterFirst(function(item: Navigation.Models.NavigationItem, index: number) {
				return item.active === true;
			});
		}
	}
}