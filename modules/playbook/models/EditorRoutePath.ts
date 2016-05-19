/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorRoutePath
	extends Common.Models.RoutePath
	implements Common.Interfaces.IRoutePath {

		constructor() {
			super();
		}

		public initialize(field: Common.Interfaces.IField, route: Common.Interfaces.IFieldElement): void {
			super.initialize(field, route);
			this.graphics.setOriginalStroke('#001199');
			this.route.layer.addLayer(this.layer);
		}
	}

}