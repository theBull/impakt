/// <reference path='./models.ts' />

module Navigation.Models {
	export class NavigationItem
	extends Common.Models.Storable {
		public name: string; // the name of the navigation item - used as a handle
		public label: string; // the text display label
		public glyphicon: string; // just the suffix ('glyphicon glyphicon-xxxx', you provide xxxx)
		public path: string; // navigation path for angular router (e.g. "/playbook")
		public isActive: boolean;

		constructor(
			name: string,
			label: string,
			glyphicon: string,
			path: string,
			isActive: boolean
		) {
			super();
			this.name = name;
			this.label = label;
			this.glyphicon = glyphicon;
			this.path = path;
			this.isActive = isActive === true;
		}
	}
}