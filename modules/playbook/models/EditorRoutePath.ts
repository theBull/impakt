/// <reference path='./models.ts' />

module Playbook.Models {

	export class EditorRoutePath
	extends Common.Models.RoutePath
	implements Common.Interfaces.IRoutePath {

		constructor(route: Common.Interfaces.IRoute) {
			super(route);

            this.layer.graphics.setOriginalStroke('#001199');
            this.route.layer.addLayer(this.layer);
		}
	}

}