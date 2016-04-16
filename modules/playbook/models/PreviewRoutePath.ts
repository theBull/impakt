/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewRoutePath
	extends Common.Models.RoutePath
	implements Common.Interfaces.IRoutePath {

		constructor(route: Common.Interfaces.IRoute) {
			super(route);

			this.layer.graphics.setStrokeWidth(1);
			this.layer.graphics.refresh();
		}
	}

}