/// <reference path='./models.ts' />

module Navigation.Models {
	export class NavigationItem
	extends Common.Models.Storable {
		public name: string; // the name of the navigation item - used as a handle
		public label: string; // the text display label
		public glyphicon: string; // just the suffix ('glyphicon glyphicon-xxxx', you provide xxxx)
		public path: string; // navigation path for angular router (e.g. "/playbook")
		public active: boolean;
		public activationCallback: Function;

		constructor(
			name: string,
			label: string,
			glyphicon: string,
			path: string,
			active: boolean,
			activationCallback: Function
		) {
			super();
			this.name = name;
			this.label = label;
			this.glyphicon = glyphicon;
			this.path = path;
			this.active = active === true;
			this.activationCallback = activationCallback;
		}

		public activate() {
			this.active = true;
			this.activationCallback(this);
		}

		public deactivate() {
			this.active = false;
		}

		public toggleActivation() {
			this.active = !this.active;
			if (this.active === true)
				this.activate();
		}
	}
}